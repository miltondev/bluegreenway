import * as React from 'react';
import { get } from 'lodash';
import { vizJSON } from '../models/common.js';
import sassVars from '../../scss/variables.json';

export default class LeafletMap extends React.Component {
	constructor (props) {
		super(props);

		this.mapState = {
			initing: false,
			map: null,
			layers: null,
			projects: {
				layerData: {},
				popups: {}
			}
		};
	}

	componentWillMount () {
		const storeState = this.props.store.getState();
		if (!get(storeState, 'geodata.projects.geojson.features')) {
			this.props.actions.fetchProjectsGeoData();
		}
	}

	componentDidMount () {
		const storeState = this.props.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = nextProps.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));

		this.updateMapLayers(storeState);
	}

	componentDidUpdate (prevProps, prevState) {
		// hide controls after map has initialized
		if (this.mapState.map) {
			// i know, i know...
			$('.leaflet-control-attribution.leaflet-control').remove();
		}
	}

	updateMapLayers (storeState) {
		if (!this.mapState.map) return;

		let { mapLayersPicker, projects } = storeState;

		if (mapLayersPicker.transportation[0].checked) {
			this.mapState.layers.biking.show();
		} else {
			this.mapState.layers.biking.hide();
		}

		if (mapLayersPicker.transportation[1].checked) {
			this.mapState.layers.green_connections.show();
		} else {
			this.mapState.layers.green_connections.hide();
		}

		if (mapLayersPicker.layers[0].checked) {
			this.mapState.layers.pois.show();
		} else {
			this.mapState.layers.pois.hide();
		}

		if (mapLayersPicker.projects) {
			this.mapState.map.addLayer(this.mapState.layers.projects);
		} else {
			this.mapState.map.removeLayer(this.mapState.layers.projects);
		}

		if (projects.selectedProject) {
			let popup = this.mapState.projects.popups[projects.selectedProject.id];

			// If popup has not yet been created, create it
			if (!popup) {
				this.initProjectPopup(projects.selectedProject);
				popup = this.mapState.projects.popups[projects.selectedProject.id];
			}

			// ...and then open it.
			if (popup) {
				popup.openOn(this.mapState.map);
			}
		}
	}

	initMap (projectsGeoJSON) {
		// if already inited, or begun initing, bail
		if (this.mapState.initing || this.mapState.map) return;

		// invalid geojson
		if (!projectsGeoJSON || !projectsGeoJSON.features) return;

		this.mapState.initing = true;

		const options = {
			cartodb_logo: false,
			center: [37.757450, -122.406235],
			dragging: true,
			infowindow: false,
			legends: false,
			scrollwheel: true,
			search: false,
			shareable: false,
			zoom: 13,
			zoomControl: false
		};

		let projectsLayer = this.createProjectsMapLayer(projectsGeoJSON);

		cartodb.createVis('bgw-map', vizJSON, options)
			.on('done', (vis, layers) => {

				// to get the Leaflet map object
				let map = vis.getNativeMap();

				const initMap = () => {
					// console.log(vis, layers);
					// the first layer (layers[0]) is typically the basemap used in the visualization
					// the second layer is the one containing the actual styled geodata layers
					// cartodb.js refers to these as "subLayers", yes it's confusing!
					const layer = layers[1];
					const sublayerCount = layer.getSubLayerCount();
					let sublayers = {};

					// we can iterate over subLayers like this
					for (let i = 0; i < sublayerCount; i++) {
						// layer.getSubLayer(i).hide();
					}

					// typically it's useful to store them like so:
					sublayers.pois = layer.getSubLayer(3);
					sublayers.biking = layer.getSubLayer(2);
					sublayers.green_connections = layer.getSubLayer(1);
					sublayers.zones = layer.getSubLayer(0);

					this.setMapControls(map);

					// fit map to encompass projects bounds,
					// and nudge it below header and to right of page content
					// note: projectsLayer is added/removed via an action, not here.
					let leftPadding = Math.max(0, (window.innerWidth - sassVars.breakpoints.width.small));
					map.fitBounds(projectsLayer.getBounds(), {
						paddingTopLeft: [leftPadding, sassVars.header.height],
						paddingBottomRight: [0, 0],
						animate: false
					});

					this.mapState.initing = false;
					this.mapState.map = map;
					this.mapState.layers = sublayers;

					this.mapState.layers.projects = projectsLayer;

					this.forceUpdate();

				};

				// wait to intiialize until Leaflet is ready.
				if (map._loaded) {
					initMap();
				} else {
					map.on('load', initMap);
				}

			})

			.on('error', err => {
				console.warn(err);
			});
	}

	createProjectsMapLayer (projectsGeoJSON) {
		return L.geoJson(projectsGeoJSON, {
			style: feature => {
				// to do: style features based on a bgw_zone_id
			},

			// Project data load from the CMS separately from the project geojson.
			// So, we store the geojson feature and map layer to use for creating a popup
			// when the selected project changes, either via a layer click handler (assigned here),
			// or programmatically via an action fired from elsewhere.
			onEachFeature: (feature, layer) => {
				this.mapState.projects.layerData[feature.properties.bgw_id] = {
					feature,
					layer,
				};
				layer.on('click', (event) => this.onProjectFeatureClicked(feature, layer));
			}
		});
	}

	/**
	 * Create project popup on demand, since project data may not yet be available from the CMS
	 * when the project geojson is loaded and added to the map.
	 */
	initProjectPopup (project) {
		let layerData = this.mapState.projects.layerData[project.id];
		if (!layerData) return null;

		let { feature, layer } = layerData;
		
		let popupContent = `<h3>${ project.name }</h3><p>${ project.description }</p>`;

		this.mapState.projects.popups[project.id] = L.popup()
			.setLatLng(layer.getBounds().getCenter())
			.setContent(popupContent);

	}

	/**
	 * Update selected project on click, but only if the CMS project data
	 * associated with the clicked project geojson layer have loaded.
	 */
	onProjectFeatureClicked (feature) {
		const projects = get(this.props.store.getState().projects, 'data.items');
		if (!projects.length) return;

		let projectId = feature.properties.bgw_id,
			project = projects.find(project => project.id === projectId);

		if (project) {
			this.props.actions.updateSelectedProject(project);
		} else {
			console.warn(`No project with id ${ projectId } found in projects returned from SFPA CMS.`);
		}
	}

	setMapControls (map) {
		new L.Control.Zoom({position: 'bottomright'}).addTo(map);
	}

	render () {
		// note: map container stays hidden until cartodb is fully initialized.
		return (
			<div id='bgw-map' ref='leafletMap' className={ `map-container${ !this.mapState.layers ? ' hidden': '' }` } />
		);
	}
}
