import { Widget, VDOM } from "cx/ui";
import { PureContainer } from "cx/widgets";
import { debounce } from "cx/util";
import { Polygon as ReactPolygon } from "react-google-maps";

class ReactPolygonEnhanced extends ReactPolygon {
    componentDidMount() {
        super.componentDidMount();

        let { instance } = this.props;
        let { widget, data } = instance;
        if (widget.pipeInstance) instance.invoke("pipeInstance", this);

        if (data.editable) {
            this.checkPathHasChanged = debounce(
                this.checkPathHasChanged.bind(this),
                100
            );
            this.monitorPathChanges();
        }
    }

    componentDidUpdate() {
        super.componentDidUpdate(...arguments);

        //new instance of the path is available after update
        if (this.pathWithEvents) this.monitorPathChanges();
    }

    monitorPathChanges() {
        //any attempt on clearing events throws an error

        let path = this.getPath();
        if (path != this.pathWithEvents) {
            google.maps.event.addListener(
                path,
                "insert_at",
                this.checkPathHasChanged
            );
            google.maps.event.addListener(
                path,
                "remove_at",
                this.checkPathHasChanged
            );
            google.maps.event.addListener(
                path,
                "set_at",
                this.checkPathHasChanged
            );
            this.pathWithEvents = path;
        }
    }

    checkPathHasChanged() {
        var pts = this.getPath().b.map(p => ({
            lat: p.lat(),
            lng: p.lng()
        }));
        this.props.instance.set("path", pts);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        let { instance } = this.props;
        let { widget } = instance;
        if (widget.pipeInstance) instance.invoke("pipeInstance", null);
    }
}

export class Polygon extends Widget {
    declareData() {
        super.declareData(...arguments, {
            draggable: undefined,
            editable: undefined,
            options: { structured: true },
            path: undefined,
            paths: undefined
        });
    }

    onInit(context, instance) {
        instance.events = this.wireEvents(instance, [
            "onClick",
            "onDblClick",
            "onDrag",
            "onDragEnd",
            "onDragStart",
            "onMouseDown",
            "onMouseMove",
            "onMouseOut",
            "onMouseOver",
            "onMouseUp",
            "onRightClick"
        ]);
    }

    wireEvents(instance, events) {
        var map = [];
        events.map(name => {
            if (this[name]) {
                map[name] = e => instance.invoke(name, e, instance);
            }
        });
        return map;
    }

    render(context, instance, key) {
        return (
            <ReactPolygonEnhanced
                {...instance.data}
                {...instance.events}
                instance={instance}
                key={key}
            />
        );
    }
}
