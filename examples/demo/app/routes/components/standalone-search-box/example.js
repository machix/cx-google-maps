import {HtmlElement, Menu, Toast, TextField, FlexRow, FlexCol, Grid} from 'cx/widgets';

import {StandaloneSearchBox} from 'cx-google-maps';

import {VDOM, Controller as CxController} from 'cx/ui';

class Controller extends CxController {
    onInit() {
        this.store.set('$page.places', []);
    }

    pipeSearchBoxInstance(instance) {
        this.searchBox = instance;
    }

    onSearchPlacesChanged(e) {
        let places = this.searchBox.getPlaces();
        if (places.length < 1) return;
        let place = places[0];

        this.store.update('$page.places', ps => {
            return [...ps, {
                address: place.formatted_address,
                name: place.name,
                query: this.store.get('$page.text')
            }];
        });
    }
}

export default (
    <cx>
        <FlexCol 
            class="flex-1" controller={Controller} 
            pad>
            <h4>Cx TextField</h4>
            <StandaloneSearchBox
                onPlacesChanged="onSearchPlacesChanged"
                pipeInstance="pipeSearchBoxInstance">
                <TextField
                    placeholder="Search for a place..."
                    style="width: 100%"
                    class="flex-1 autogrow"
                    value:bind="$page.text"
                    clear
                />
            </StandaloneSearchBox>
            <br/>
            <h4>Previous searches</h4>
            <Grid 
                columns={[{
                    header: 'Address',
                    sortable: true,
                    field: 'address'
                }, {
                    header: 'Name',
                    field: 'name',
                    sortable: true
                }, {
                    header: 'Query',
                    field: 'query',
                    sortable: true
                }]}

                emptyText="No previous searches."

                records:bind="$page.places"
            />
        </FlexCol>
    </cx>
);
