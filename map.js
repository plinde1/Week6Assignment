var Main;

require(
    [
        "esri/Map",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/layers/ElevationLayer",
        "esri/views/SceneView"
    ],
    function(
        Map, Graphic, GraphicsLayer, ElevationLayer, SceneView
    ) {
        $(document).ready(function() {
            Main = (function() {
                const layer = new ElevationLayer({
                    url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                });

                const map = new Map({
                    basemap: "hybrid",
                    ground: {
                        layers: [layer]
                    },
                });

                const view = new SceneView({
                    container: "map",
                    viewingMode: "global",
                    map: map,
                    camera: {
                        position: {
                            x: -105.503,
                            y: 44.270,
                            z: 20000000,
                            spatialReference: {
                                wkid: 4326
                            }
                        },
                        heading: 0,
                        tilt: 0
                    },
                    popup: {
                        dockEnabled: true,
                        dockOptions: {
                            breakpoint: false
                        }
                    },
                    environment: {
                        lighting: {
                            directShadowsEnabled: false
                        }
                    }
                });

                const initMap = function(myStuff) {
                    const graphicsLayer = new GraphicsLayer();
                    map.add(graphicsLayer);

                    for (const [key, value] of Object.entries(myStuff)) {
                        console.log(key, value);
                        const point = {
                            type: "point", 
                            x: value.coord[0],
                            y: value.coord[1],
                            z: 10000
                        };

                        const markerSymbol = {
                            type: "simple-marker", 
                            style: "diamond",
                            color: [0, 255, 255],
                            outline: {
                                color: [0, 0, 0],
                                width: 2
                            }
                        };

                        const pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                            popupTemplate: {
                                title: key,
                                content: `
                                    <br> City: ${value.city} <br><br>
                                    State: ${value.state} <br><br>
                                    Coordinates: ${value.coord[0]}, ${value.coord[1]} <br><br>
                                `
                            }
                        });
                        graphicsLayer.add(pointGraphic);
                    }

                    view.on("click", function(event) {
                        view.hitTest(event).then(function(response) {
                            const graphic = response.results[0]?.graphic;
                            if (graphic) {
                                view.goTo({
                                    target: graphic.geometry,
                                    zoom: 10
                                });
                            }
                        });
                    });
                };

                initMap(myStuff);

                return {};
            })();
        });
    }
);



    
