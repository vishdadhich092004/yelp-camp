
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12   // starting zoom
});
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h4>${campground.title}</h4><p>${campground.location}</p>`
);
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)