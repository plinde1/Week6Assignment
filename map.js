var Main;

require([
    "esri/Map",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/ElevationLayer",
    "esri/views/SceneView",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/widgets/Search"
], function(Map, Graphic, GraphicsLayer, ElevationLayer, SceneView, Point, SimpleMarkerSymbol, Search) {
    $(document).ready(function() {
        Main = (function() {
            let layer = new ElevationLayer({
                url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });

            var map = new Map({
                basemap: "hybrid",
                ground: {
                    layers: [layer]
                },
            });

            var view = new SceneView({
                container: "map",
                viewingMode: "global",
                map: map,
                camera: {
                    position: {
                        x: -105.503,
                        y: 44.270,
                        z: 20000000,
                        spatialReference: { wkid: 4326 }
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

            const graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);

            const cities = {
                "Laramie": { coord: [-105.598927, 41.306380] },
                "Atlanta": { coord: [-84.412595, 33.765545] },
                "Cheyenne": { coord: [-104.80999, 41.14638] },
                "Juneau": { coord: [-134.462813, 58.499564] },
                "Island Of Hawai'i": { coord: [-155.228528, 19.324689] }
            };

            const initMap = function() {
                for (const [key, value] of Object.entries(myStuff)) {
                    const point = new Point({
                        x: value.coord[0],
                        y: value.coord[1],
                        z: 10000,
                        spatialReference: { wkid: 4326 }
                    });

                    const markerSymbol = new SimpleMarkerSymbol({
                        style: "diamond",
                        color: [0, 255, 255],
                        outline: {
                            color: [0, 0, 0],
                            width: 2
                        }
                    });

                    const pointGraphic = new Graphic({
                        geometry: point,
                        symbol: markerSymbol,
                        popupTemplate: {
                            title: key,
                            content: `
                                <br> City: ${value.city} <br><br>
                                State: ${value.state} <br><br>
                                Coordinates: ${value.coord[0]},${value.coord[1]} <br><br>
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

            const createSearchWidget = function() {
                const searchWidget = new Search({
                    view: view,
                    sources: [{
                        locator: null,
                        getSuggestions: function(value) {
                            return Object.keys(cities)
                                .filter(city => city.toLowerCase().startsWith(value.toLowerCase()))
                                .map(city => ({
                                    name: city
                                }));
                        }
                    }]
                });

                view.ui.add(searchWidget, "top-right");
                searchWidget.on("select-result", function(event) {
                    const city = event.result.name;
                    const coords = cities[city].coord;
                    view.goTo({
                        target: new Point({
                            x: coords[0],
                            y: coords[1],
                            spatialReference: { wkid: 4326 }
                        }),
                        zoom: 10
                    });
                });
            };

            createSearchWidget();
            initMap();

            return {};
        })();
    });
});

    
    




    
