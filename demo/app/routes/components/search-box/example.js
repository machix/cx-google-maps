import { 
    HtmlElement, 
    Menu,
    Toast
} from 'cx/widgets';

import {
    GoogleMap,
    SearchBox
} from 'cx-google-maps';

import { VDOM, Controller as CxController } from 'cx/ui';
import config from './config';

const containerElement = <div style={{ position: "relative", flex: 1 }} />;
const mapElement =
    <div
        style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
    />
;

class Controller extends CxController {
    getDefaults() { 
        return {
            center: {
                lat: 41.87811360,
                lng: -87.62979820
            },
            zoom: 12
        };
    }

    onInit() {
        this.store.init('$page.mapdefaults', this.getDefaults());        
        this.store.init('$page.map', this.getDefaults());        
    }

    pipeMapInstance(instance) {
        this.map = instance;
    }

    pipeSearchBoxInstance(instance) {
        this.searchBox = instance;
    }

    onSearchPlacesChanged(e) {
        let places = this.searchBox.getPlaces();
        if (places.length < 1)
            return;
        
        Toast.create({
            message: `Place selected: ${places[0].formatted_address}`,
            timeout: 3000
        }).open();

        let location = places[0].geometry.location
        this.map.panTo(location);
            
        // We could have just make use of the :bind in the map
        // center (see index.js) and pan like this:
        
        // this.store.set('$page.map.center', location);
        
        // However, in this case, panning would be instant,
        // whereas Google Maps panTo provides smooth panning
        // when possible.
    }
}

export default <cx>
    <GoogleMap
        controller={Controller}
        containerElement={containerElement}
        mapElement={mapElement}
        pipeInstance="pipeMapInstance"
        defaultCenter:bind="$page.map.center"
        defaultZoom:bind="$page.map.zoom"
        center:bind="$page.map.center"
        zoom:bind="$page.map.zoom"
        options={{
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        }}
    >
        <SearchBox
            controlPosition={google.maps.ControlPosition.TOP_CENTER}
            onPlacesChanged="onSearchPlacesChanged"
            pipeInstance="pipeSearchBoxInstance"
            inputPlaceholder="Search..."
            inputStyle={{
                boxSizing: `border-box`,
                MozBoxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `300px`,
                height: `32px`,
                marginTop: `10px`,
                padding: `0 12px`,
                borderRadius: `0px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`
            }}
        />    
    </GoogleMap>
</cx>;