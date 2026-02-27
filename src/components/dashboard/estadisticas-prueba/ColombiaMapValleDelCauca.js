import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client'; // Necesario para el nuevo GeoJSON

// Función para generar puntos aleatorios dentro del Valle del Cauca
const generateCaucaPoints = (count) => {
    const points = [];
    // Límites aproximados del Valle del Cauca
    const minLat = 3.0;
    const maxLat = 5.0;
    const minLon = -77.5;
    const maxLon = -75.5;

    for (let i = 0; i < count; i++) {
        const randomLat = Math.random() * (maxLat - minLat) + minLat;
        const randomLon = Math.random() * (maxLon - minLon) + minLon;

        points.push({
            name: `Punto Aleatorio ${i + 1}`,
            lat: randomLat,
            lon: randomLon
        });
    }
    return points;
};

const ColombiaMap = ({ geojsonDataUrl }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    let active = d3.select(null); // Variable para rastrear el elemento activo (zoom)

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        // Definimos el ancho y una altura proporcional (ej. 4:3) basada en el contenedor
        const width = 1200;
        const height = 800; 
        
        // Limpieza del SVG al re-renderizar
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("height", height); // Altura para el cálculo de viewBox

        // 1. Tooltip (adjunto al body)
        const tooltip = d3.select("body").append("div")
            .attr("id", "map-tooltip")
            .style("position", "absolute")
            .style("padding", "8px")
            .style("background", "rgba(0, 0, 0, 0.75)")
            .style("color", "white")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0); 
        
        const g = svg.append("g"); 

        // 2. Proyección (sin valores fijos de escala ni traslación)
        const projection = d3.geoMercator();
        const pathGenerator = d3.geoPath().projection(projection);

        // Generamos los puntos (se re-generan en cada render si la dependencia cambia)
        const pointData = generateCaucaPoints(100); 

        // --- FUNCIÓN DE ZOOM (CLIC) ---
        function clicked(event, d) {
            
            // Lógica de activación/desactivación
            if (active.node() === this) {
                active.classed("active", false);
                active = d3.select(null);
            } else {
                active.classed("active", false);
                active = d3.select(this).classed("active", true);
            }

            let x, y, k;
            
            if (active.node()) {
                // Cálculo del bounding box y centro del elemento clicado
                const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
                
                // k: escala (zoom). Se ajusta para que el elemento quepa en el 90% del área.
                k = Math.min(width / (x1 - x0), height / (y1 - y0)) * 0.9;
                
                x = (x0 + x1) / 2;
                y = (y0 + y1) / 2;
                
            } else {
                // Reseteo: Volvemos a la vista inicial (k=1)
                // Esto no necesita `projection.fitSize` aquí si se hizo una vez en la carga.
                x = width / 2;
                y = height / 2;
                k = 1; 
            }
            
            // Aplicar transición a todo el grupo
            g.transition()
                .duration(750)
                .attr("transform", 
                    `translate(${width / 2}, ${height / 2})` +
                    `scale(${k > 1 ? k : 1})` + 
                    `translate(${-x}, ${-y})`
                );
            
            // Lógica para ajustar el grosor del borde y de los puntos
            if (!active.node()) {
                g.selectAll(".municipio").transition().duration(750).style("stroke-width", "0.5px");
                g.selectAll(".city-point").transition().duration(750).style("stroke-width", "0.5px");
            } else {
                g.selectAll(".municipio").style("stroke-width", 0.5 / k + "px");
                d3.select(this).style("stroke-width", 1 / k + "px");
                g.selectAll(".city-point").style("stroke-width", 0.5 / k + "px");
            }
        }
        // --- FIN FUNCIÓN DE ZOOM (CLIC) ---


        // Carga de datos
        d3.json(geojsonDataUrl).then(data => {
            
            // CONVERSIÓN: TopoJSON a GeoJSON (usando 'mpios' como capa)
            const geojson = topojson.feature(data, data.objects.mpios); 
            
            // AJUSTE INICIAL: fitSize para que el mapa quepa en el SVG
            projection.fitSize([width, height], geojson); 
            
            // VIEWBOX: SVG se escala al 100% del ancho
            svg.attr("viewBox", `0 0 ${width} ${height}`);

            // 3. DIBUJO DE MUNICIPIOS
            g.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr("d", pathGenerator)
                .attr("class", "municipio") 
                .style("fill", "#ccc")
                .style("stroke", "#333")
                .style("stroke-width", "0.5px")
                
                // EVENTOS: Tooltip usa 'd.properties.name' para el nombre del municipio
                .on("mouseover", function(event, d) {
                    d3.select(this).style("fill", "orange");
                    const municipalityName = d.properties.name || 'Municipio Desconocido';
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`**${municipalityName}**`).style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px"); 
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    if (!d3.select(this).classed("active")) {
                         d3.select(this).style("fill", "#ccc");
                    }
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .on("click", clicked); 
            
            // Clic en el fondo para resetear el zoom
            svg.on("click", function(event) {
                if (event.target === svg.node() || event.target === g.node()) {
                    clicked(event, null);
                }
            });

            // 4. DIBUJO DE PUNTOS DE UBICACIÓN
            g.selectAll(".city-point")
                .data(pointData)
                .enter()
                .append("circle")
                .attr("class", "city-point")
                // Proyectamos las coordenadas de Lon/Lat a X/Y
                .attr("cx", d => projection([d.lon, d.lat])[0]) 
                .attr("cy", d => projection([d.lon, d.lat])[1])
                .attr("r", 3) 
                .style("fill", "red")
                .style("stroke", "white")
                .style("opacity", 0.7) 
                .style("stroke-width", 0.5)
                
                // Interacción de los puntos
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("r", 5);
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`**${d.name}**`).style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).attr("r", 3);
                    tooltip.transition().duration(500).style("opacity", 0);
                });


        }).catch(error => console.error("Error cargando GeoJSON:", error));
        
        // Función de limpieza
        return () => {
            d3.select(svgRef.current).selectAll("*").remove(); 
            tooltip.remove();
        };

    }, [geojsonDataUrl]); 

    // Renderizar: El div contenedor es necesario para obtener el ancho real.
    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <svg ref={svgRef} style={{ width: '100%', display: 'block' }}></svg>
        </div>
    );
};

export default ColombiaMap;