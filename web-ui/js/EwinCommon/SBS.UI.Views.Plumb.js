// <reference path="jquery-1.5.1-vsdoc.js" />

var SBS = SBS || {};
SBS.UI = SBS.UI || {};
SBS.UI.Views = SBS.UI.Views || {};
SBS.UI.Views.Plumb = {
    init: function () {
        jsPlumb.importDefaults({
            // default drag options
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            // default to blue at one end and green at the other
            EndpointStyles: [{ fillStyle: '#225588' }, { fillStyle: '#558822'}],
            // blue endpoints 7 px; green endpoints 11.
            Endpoints: [["Dot", { radius: 7}], ["Dot", { radius: 11}]],
            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
            ConnectionOverlays: [
					["Arrow", { location: 1}],
					["Label", {
					    location: 0.1,
					    id: "label",
					    cssClass: "aLabel"
					}]
				]
        });
        var connectorPaintStyle = {
            lineWidth: 5,
            strokeStyle: "#deea18",
            joinstyle: "round"
        },
        // .. and this is the hover style. 
			connectorHoverStyle = {
			    lineWidth: 7,
			    strokeStyle: "#2e2aF8"
			};
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#225588", radius: 7 },
            isSource: true,
            connector: ["Flowchart", { stub: 40}],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: connectorHoverStyle,
            connectorHoverStyle: connectorHoverStyle
        };
        targetEndpoint = {
            endpoint: "Rectangle",
            paintStyle: { fillStyle: "#558822", radius: 11 },
            hoverPaintStyle: connectorHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true
        };
        jsPlumb.bind("jsPlumbConnection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });
        jsPlumb.bind("click", function (conn, originalEvent) {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                jsPlumb.detach(conn);
        });
    },



    AddEndpoints: function (toId, sourceAnchors, targetAnchors) {
        var allSourceEndpoints = [], allTargetEndpoints = [];
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            allSourceEndpoints.push(jsPlumb.addEndpoint(toId, sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID }));
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            allTargetEndpoints.push(jsPlumb.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID }));
        }
    }

}


//Page load events
$(document).ready(
	function () {
	    //all JavaScript that needs to be call onPageLoad can be put here.
	    SBS.UI.Views.Plumb.init();
	}
);