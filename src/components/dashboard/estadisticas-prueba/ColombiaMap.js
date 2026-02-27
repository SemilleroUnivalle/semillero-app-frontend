import React, { useEffect, useRef, useState } from 'react'; // Importar useState
import * as d3 from 'd3';

// --- NUEVOS DATOS DE CIUDADES CON CONTEO Y COORDENADAS APROXIMADAS ---
const generateCityData = () => {
    // Coordenadas aproximadas para municipios de Valle del Cauca (ejemplo)
    return [
        { name: "Cali", count: 50, lat: 3.4516, lon: -76.5320, description: "Capital del Valle del Cauca, importante centro económico y cultural." },
        { name: "Tuluá", count: 10, lat: 4.0833, lon: -76.1956, description: "Conocida como 'Corazón del Valle', es un centro agrícola." },
        { name: "Palmira", count: 8, lat: 3.5385, lon: -76.2974, description: "La capital agrícola de Colombia, famosa por la caña de azúcar." },
        { name: "Jamundí", count: 22, lat: 3.2505, lon: -76.5414, description: "Cercana a Cali, en crecimiento y conocida por su gastronomía." },
        { name: "Buga", count: 2, lat: 3.9037, lon: -76.2996, description: "Hogar de la Basílica del Señor de los Milagros, un destino religioso." },
        { name: "Cartago", count: 2, lat: 4.7001, lon: -75.9135, description: "Famosa por sus bordados y como punto de conexión vial." },
        { name: "Buenaventura", count: 2, lat: 3.8741, lon: -77.0272, description: "Principal puerto marítimo de Colombia en el Pacífico." },
        { name: "Yumbo", count: 4, lat: 3.5501, lon: -76.4952, description: "Un importante centro industrial del Valle del Cauca." },
    ];
};
// -----------------------------------------------------------------------

// --- COMPONENTE MODAL BÁSICO (PUEDES ESTILIZARLO CON CSS) ---
const CityModal = ({ isOpen, city, onClose }) => {
    if (!isOpen || !city) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000 // Asegura que esté por encima del mapa
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '400px',
                width: '90%',
                position: 'relative'
            }}>
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2em',
                        cursor: 'pointer',
                        color: '#333'
                    }}
                >
                    &times; {/* Carácter 'x' para cerrar */}
                </button>
                <h2>{city.name}</h2>
                <p><strong>Estudiantes:</strong> {city.count}</p>
                <p>{city.description}</p>
                {/* Puedes añadir más información aquí */}
            </div>
        </div>
    );
};
// -----------------------------------------------------------


const ColombiaMap = ({ geojsonDataUrl }) => {
    const svgRef = useRef(null);
    let active = d3.select(null); 

    // --- ESTADO PARA CONTROLAR EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    // --------------------------------------

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 1200;
        const height = 800;
        const cityData = generateCityData();

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const tooltip = d3.select("body").append("div")
            .attr("id", "map-tooltip")
            .style("position", "absolute")
            .style("padding", "5px")
            .style("background", "rgba(0, 0, 0, 0.75)")
            .style("color", "white")
            .style("border-radius", "3px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        const g = svg.append("g");
        
        const initialScale = 8000;
        const initialCenter = [-74, 4];
        
        const projection = d3.geoMercator()
            .scale(initialScale)
            .center(initialCenter)
            .translate([width / 2, height / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        function clicked(event, d) {
            if (active.node() === this) {
                active.classed("active", false);
                active = d3.select(null);
            } else {
                active.classed("active", false);
                active = d3.select(this).classed("active", true);
            }

            let x, y, k; 

            if (active.node()) {
                const bounds = pathGenerator.bounds(d);
                const dx = bounds[1][0] - bounds[0][0]; 
                const dy = bounds[1][1] - bounds[0][1]; 
                
                k = Math.min(width / dx, height / dy) * 0.9; 
                
                x = (bounds[0][0] + bounds[1][0]) / 2;
                y = (bounds[0][1] + bounds[1][1]) / 2;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1; 
            }
            
            g.transition()
                .duration(750) 
                .attr("transform", 
                    `translate(${width / 2}, ${height / 2})` +
                    `scale(${k > 1 ? k : 1})` + 
                    `translate(${-x}, ${-y})`
                );
            
            d3.selectAll(".department.active").style("stroke-width", 2 / k + "px");
            d3.selectAll(".department:not(.active)").style("stroke-width", 0.5 / k + "px"); 
            
            if (!active.node()) {
                d3.selectAll(".department").style("stroke-width", "0.5px");
            }
        }

        d3.json(geojsonDataUrl).then(data => {
            const geojson = data;

            g.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr("d", pathGenerator)
                .attr("class", "department")
                .style("fill", "#ccc")
                .style("stroke", "#333")
                .style("stroke-width", "0.5px")
                .on("mouseover", function(event, d) {
                    d3.select(this).style("fill", "#e8e8e8");
                    const departmentName = d.properties.NOMBRE_DPT || 'Departamento Desconocido';
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`**${departmentName}**`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px"); 
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    if (!d3.select(this).classed("active")) {
                             d3.select(this).style("fill", "#ccc");
                    }
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .on("click", clicked); 
            
            svg.on("click", function(event) {
                if (event.target === svg.node()) {
                    clicked(event, null);
                }
            });

            const maxCount = d3.max(cityData, d => d.count);
            
            const radiusScale = d3.scaleSqrt()
                .domain([0, maxCount])
                .range([5, 30]);

            g.selectAll("circle")
                .data(cityData) 
                .enter()
                .append("circle")
                .attr("class", "city-bubble")
                
                .attr("cx", d => projection([d.lon, d.lat])[0]) 
                .attr("cy", d => projection([d.lon, d.lat])[1])
                
                .attr("r", d => radiusScale(d.count)) 

                .style("fill", "red")
                .style("fill-opacity", 0.6) 
                .style("stroke", "darkred")
                .style("stroke-width", 1)
                
                .on("mouseover", function(event, d) {
                    d3.select(this).style("fill-opacity", 0.9);
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`**${d.name}**: ${d.count} estudiantes`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).style("fill-opacity", 0.6);
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                // --- NUEVO EVENTO onClick PARA ABRIR EL MODAL ---
                .on("click", function(event, d) {
                    setSelectedCity(d);      // Guarda la ciudad seleccionada
                    setIsModalOpen(true);     // Abre el modal
                });
                // -------------------------------------------------


        }).catch(error => console.error("Error cargando GeoJSON:", error));
        
        return () => {
            d3.select(svgRef.current).selectAll("*").remove(); 
            tooltip.remove();
        };

    }, [geojsonDataUrl, setIsModalOpen, setSelectedCity]); // Añadir dependencias de estado

    // -------------------------------------------------------------
    // --- Renderizado del mapa y el modal ---
    return (
        <>
            <svg ref={svgRef}></svg>
            <CityModal 
                isOpen={isModalOpen} 
                city={selectedCity} 
                onClose={() => setIsModalOpen(false)} // Función para cerrar el modal
            />
        </>
    );
    // -------------------------------------------------------------
};

export default ColombiaMap;