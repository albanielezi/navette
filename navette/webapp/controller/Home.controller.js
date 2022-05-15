sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("npmnavette.navette.controller.Home", {
            onInit: function () {
                // Main Model to controll view (bussy status etc)
                const oMainModel = {
                    trasferBusy: false,
                    receiveBusy: false
                };
                this._setModel(oMainModel, "mainModel");

                //Create the empty model 
                //Table binding
                var oItemData = [{
                    'index': 1,
                    'wipout': '',
                    'ordine': '',
                    'materiale': '',
                    'descrizione': '',
                    'icona': '',
                    'stato': '',
                    'centro_di_lavoro': '',
                    'quantita': '',
                    'um': '',
                }];
                this.Index = 1;
                this._setModel(oItemData, "items");//Function to update the model

            },

            //******************************************CREAZIONE NAVETTA**************************************************************************//
            //Function to handle the go button of the toolbar
            onGo: function () {
                var oCheckFields = this.checkMandatoryFields();
                var oWarn = this._geti18n("mandatory");

                if (oCheckFields === false) {//if all the fields are filled make table visible
                    MessageBox.warning(oWarn);
                } else {
                    this.getView().byId("table").setVisible(true)
                }
            },

            //Function to check if all the mandatory fields are filled
            checkMandatoryFields: function () {
                // var oNavetta = this.byId("navetta").getValue();
                var oPartenza = this.byId("partenza").getValue();
                var oArrivo = this.byId("arrivo").getValue();
                var oData = this.byId("creazione").getValue();

                // if (oPartenza && oArrivo && oData) {
                return true;
                // } else {
                //     return false;
                // }
            },

            // Get text translations from i18n ----------------------------------------------------
            _geti18n: function (textName) {
                return this.getView().getModel("i18n").getResourceBundle().getText(textName);
            },

            //Function to create and update the model
            _setModel: function (items, modelName) {
                //Set the model for the added items
                var oitemModel = new JSONModel(items);//Create new model for the items	
                this.getView().setModel(oitemModel, modelName);
            },

            //Magazzino Help
            onMagazzinoHelp: function (oEvent) {
                const that = this;
                const oView = this.getView();
                const sInputValue = oEvent.getSource().getValue();
                that.getView().getModel().read("/", {
                    success: function (oData) {
                        that.getView().setModel(new JSONModel(oData.results), "order");

                        if (!that._pValueHelporderDialog) {
                            that._pValueHelporderDialog = Fragment.load({
                                id: oView.getId(),
                                name: "npmnavette.navette.fragments.magazinoHelp",
                                controller: that
                            }).then(function (oDialog) {
                                oView.addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._pValueHelporderDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.getBinding("items").filter([
                                new Filter("field", FilterOperator.Contains, sInputValue)
                            ]);
                            // Open ValueHelpDialog filtered by the input's value
                            oDialog.open(sInputValue);
                        });

                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            },
            //Magazzino Help

            //Wip Out Help
            onWipoutHelp: function (oEvent) {
                const that = this;
                const oView = this.getView();
                const sInputValue = oEvent.getSource().getValue();
                that.getView().getModel().read("/", {
                    success: function (oData) {
                        that.getView().setModel(new JSONModel(oData.results), "order");

                        if (!that._pValueHelporderDialog) {
                            that._pValueHelporderDialog = Fragment.load({
                                id: oView.getId(),
                                name: "npmnavette.navette.fragments.wipoutHelp",
                                controller: that
                            }).then(function (oDialog) {
                                oView.addDependent(oDialog);
                                return oDialog;
                            });
                        }
                        that._pValueHelporderDialog.then(function (oDialog) {
                            // Create a filter for the binding
                            oDialog.getBinding("items").filter([
                                new Filter("field", FilterOperator.Contains, sInputValue)
                            ]);
                            // Open ValueHelpDialog filtered by the input's value
                            oDialog.open(sInputValue);
                        });

                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            },
            //Wip Out Help

            //Function to handle new wip insertion
            onInsertWip: function (oEvent) {
                var oValue = oEvent.mParameters.newValue;
                var oItems = this.getView().getModel("items").getData();//Get the values for our table model 
                var oSelectedItem = oEvent.getSource().getBindingContext("items").getObject()
                var oCheckWip = this.checkExistingWip(oValue);

                //Add the values to the selected row
                for (var i = 0; i < oItems.length; i++) {
                    if (oSelectedItem.index == oItems[i].index) {
                        oItems[i].order = "123";
                        oItems[i].materiale = "material 1";
                        oItems[i].descrizione = "material description";
                        oItems[i].icona = "Green";
                        oItems[i].stato = "OK";
                        oItems[i].centro_di_lavoro = "Work center";
                        oItems[i].quantita = "100";
                        oItems[i].um = "PC";
                        break;
                    }
                }
                this.setModel(oItems);//Function to update the model	
            },

            //Function to add a new item 
            onAddItem: function (oEvent) {
                var oItems = this.getView().getModel("items").getData();//Get the values for our table model 
                this.Index = this.Index + 1; //We increment our index by 1 every time we add a new item

                //We add an empty row to our table model
                oItems.push({
                    'index': this.Index,
                    'wipout': '',
                    'ordine': '',
                    'materiale': '',
                    'descrizione': '',
                    'icona': '',
                    'stato': '',
                    'centro_di_lavoro': '',
                    'quantita': '',
                    'um': '',
                });
                this._setModel(oItems, "items");//Function to update the model
            },

            //Function to remove an item
            onDeleteItem: function (oEvent) {
                var oDeleteRecord = oEvent.getSource().getBindingContext("items").getObject();//Get the record we want to delete
                var oItems = this.getView().getModel("items").getData();//Get the values for our model and save it in a variable

                for (var i = 0; i < oItems.length; i++) {
                    if (oItems[i].index == oDeleteRecord.index) {
                        oItems.splice(i, 1);//Remove 1 record from i index
                        break;
                    }
                }
                this._setModel(oItems, "items");//Function to update the model	
            },

            //Function to check if the wip number already exists
            checkExistingWip: function (iValue) {
                var oItems = this.getView().getModel("items").getData();//Get the values for our model and save it in a variable
            },
            //********************************************TRANSFER NAVETTA*************************************************************************//            

            // Event handler for Transfer Navetta press 
            onTransferPress: function () {
                const that = this;
                const oConfirmMsg = this._geti18n("transferConfirm");
                const oWarningMsg = this._geti18n("transferWarning");
                const oNavetteNr = this.byId("navetteId").getValue();
                const oMainModel = this.getView().getModel("mainModel");

                oMainModel.setProperty("/trasferBusy", true); // Show busy loader 
                MessageBox.confirm(oConfirmMsg, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            // Check that Navette number is not empty
                            if (oNavetteNr === "") {
                                MessageBox.warning(oWarningMsg);
                                oMainModel.setProperty("/trasferBusy", false);
                            } else {  // Make request to BE
                                that.trasferNavette(oNavetteNr, oMainModel);
                            }
                        } else {
                            oMainModel.setProperty("/trasferBusy", false); // Hide busy loader 
                        }
                    }
                });
            },

            // Make request on BE to Transfer selected Navette
            trasferNavette: function (NavetteNr, MainModel) {
                MessageBox.success(`This Number: "${NavetteNr}" will be sent to backend`);
                this.byId("navetteId").setValue(""); // Clear input Field
                MainModel.setProperty("/trasferBusy", false);
            },
            //********************************************RICEZIONE NAVETTA*************************************************************************//              

            // Event handler for Receiving Navetta press 
            onReceivePress: function () {
                const that = this;
                const oWarningMsg = this._geti18n("transferWarning");
                const oNavetteNr = this.byId("recNavetteId").getValue();
                const oMainModel = this.getView().getModel("mainModel");

                // Check that Navette number is not empty
                if (oNavetteNr === "") {
                    MessageBox.warning(oWarningMsg);
                } else {  // Make request to BE
                    that.receiveWipOut(oNavetteNr, oMainModel);
                }
            },

            // Get List of WIP Outs
            receiveWipOut: function (NavetteNr, MainModel) {
                const modelNew = new JSONModel("../jsonTest/dummy.json");
                MainModel.setProperty("/receiveBusy", true);

                // Just for test to see how data will be displayed with trafic lights
                setTimeout(() => {
                    this.getView().setModel(modelNew, "wipOutList");
                    MainModel.setProperty("/receiveBusy", false);
                }, 2500);
            }

        });
    });
