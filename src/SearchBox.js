import { Widget, VDOM, PureContainer } from "cx/ui";
import ReactSearchBox from "react-google-maps/lib/components/places/SearchBox";

class ReactSearchBoxEnhanced extends ReactSearchBox {
    componentDidMount() {
        super.componentDidMount();

        let { instance } = this.props;
        let { widget } = instance;
        if (widget.pipeInstance) instance.invoke("pipeInstance", this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        let { instance } = this.props;
        let { widget } = instance;
        if (widget.pipeInstance) instance.invoke("pipeInstance", null);
    }
}

export class SearchBox extends PureContainer {
    declareData() {
        super.declareData(...arguments, {
            bounds: { structured: true },
            controlPosition: { structured: true }
        });
    }

    onInit(context, instance) {
        instance.events = this.wireEvents(instance, ["onPlacesChanged"]);
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
        var children = this.renderChildren(context, instance);
        if (children.length !== 1)
            throw Error("SearchBox should have exactly one child element.");

        return (
            <ReactSearchBoxEnhanced
                {...instance.data}
                {...instance.events}
                instance={instance}
                key={key}
            >
                <div>{children[0]}</div>
            </ReactSearchBoxEnhanced>
        );
    }
}
