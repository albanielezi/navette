sap.ui.define([], function () {
    "use strict";
    return {
        iconaColor: function (sIcona) {
            if (sIcona == "@08@") {
                return "green";
            } else if (sIcona == "") {
                return "";
            } else {
                return "red";
            }
        },

        icona: function (sIcona) {
            if (sIcona == "") {
                return "";
            } else {
                return "sap-icon://status-negative";
            }
        },

    };
});