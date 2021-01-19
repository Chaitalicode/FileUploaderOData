sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("fd.FileuploaderOData1.controller.App", {
            onInit: function () {
                var serviceurl = "/sap/opu/odata/sap/ZMYAPP_SRV_01/";
                this._model = new sap.ui.model.odata.ODataModel(serviceurl, true);
                this.getView().setModel(this._model);
                this._token = this._model.getSecurityToken();
            },

            onHandleUploadPress: function (oEvent) {
                debugger;

                var oFileUploaderValue = this.getView().byId("fileUploader").getValue();

                this.sFile = this.getView().byId("fileUploader").oFileUpload.files[0];


                var url = "/sap/opu/odata/sap/ZMYAPP_SRV_01/ImageSet";
                var oHeaders = {
                    "x-csrf-token": this._token,
                    "SLUG": this.sFile.name.split(".")[0]
                };

                 jQuery.ajax({
                    type: 'POST',
                	url: url,
                	headers: oHeaders,
                	cache: false,
                	contentType: false,
                	processData: false,
                	data: this.sFile,               
                     success: function (oEvent) {
                        console.log("succ");

                	}.bind(this),
                	error: function (err) {
                        console.log(err.status);
                        if(err.status == 500){
                         var path = URL.createObjectURL(this.sFile); 
                     this.getView().byId("imageId").setSrc(path);

                       this.getView().getModel().refresh();
                        }
                        else{
                            console.log("error :" + err);
                        }
                	}.bind(this)
                 })
            },

            FileUploadEvent: function () {
                debugger;
                var url = "/sap/opu/odata/sap/ZMYAPP_SRV_01/ImageSet";

                this.sFile = this.getView().byId("fileUploader").oFileUpload.files[0];
                var oFileUploader = this.getView().byId("fileUploader");
                oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "slug",
                    value: this.sFile.name.split(".")[0]
                }));

                oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "x-csrf-token",
                    value: this._token
                }));

                oFileUploader.setSendXHR(true);
                oFileUploader.setUploadUrl(url);
                oFileUploader.upload(true);
                var path = URL.createObjectURL(this.sFile);
                this.getView().byId("imageId").setSrc(path);
            }

        });
    });
