"use strict";
var AlprApp;
(function (AlprApp) {
    var WebComponents;
    (function (WebComponents) {
        var AlprData = /** @class */ (function (_super) {
            __extends(AlprData, _super);
            function AlprData() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.selectedOption = 0;
                _this.capturingImage = false;
                return _this;
            }
            AlprData.prototype.attached = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, messageArray, messagesString, messagesMetID, i, splitsen, message;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _super.prototype.attached.call(this);
                                _a = this._setAlprDataPo;
                                return [4 /*yield*/, this.app.service.getPersistentObject(null, "AlprApp.AlprData", null)];
                            case 1:
                                _a.apply(this, [_b.sent()]);
                                this._setCandidates([]);
                                this._setWriteOwnMessage(true);
                                this._setMessageEmptyAfterSend(false);
                                this._setPlateEmptyAfterSend(false);
                                messageArray = [];
                                messagesString = this.alprDataPo.getAttributeValue("Messages");
                                messagesMetID = messagesString.split(';');
                                // String splitsen en omzetten naar Object
                                for (i = 0; i < messagesMetID.length - 1; i++) {
                                    splitsen = messagesMetID[i].split(':');
                                    message = {
                                        id: splitsen[0],
                                        text: splitsen[1]
                                    };
                                    // Object toevoegen aan Array
                                    messageArray.push(message);
                                }
                                // Array zetten als property
                                this._setMessages(messageArray);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            //private _imageCaptured(e: Event) {
            //    this._setTrueAfterPictureUpload(true);
            //    this.input = e.target as HTMLInputElement;
            //    if (this.input.files && this.input.files[0]) {
            //        var reader = new FileReader();
            //        this.alprDataPo.beginEdit();
            //        var tempThis = this;
            //        reader.addEventListener(
            //            "load",
            //            async function () {
            //                //mijn code om de image te tonen
            //                var img = document.createElement('img');
            //                img.setAttribute('src', reader.result.toString());
            //                img.setAttribute('class', "thumb-image img-fluid");
            //                var imageHolder = document.getElementById("image-holder");
            //                imageHolder.innerHTML = "";
            //                imageHolder.appendChild(img);
            //                //tot hier
            //                setInterval(async () => {
            //                    // code om image na te kijken op nummerplaat
            //                    var src = reader.result;
            //                    await tempThis.alprDataPo.setAttributeValue("ImageData", src);
            //                    var returnedPO = await tempThis.alprDataPo.getAction("ProcessImage").execute();
            //                    tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate") as string;
            //                    tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));
            //                    var plate = tempThis.alprDataPo.getAttributeValue("LicensePlate");
            //                    if (plate != null) {
            //                        if (plate === "null" || plate === "" || plate.length > 12) {
            //                            tempThis._setPlateEmptyAfterSend(true);
            //                            tempThis._setShowCandidates(false)
            //                            return;
            //                        } else {
            //                            tempThis._setPlateEmptyAfterSend(false);
            //                        }
            //                    } else {
            //                        tempThis._setPlateEmptyAfterSend(true);
            //                        tempThis._setShowCandidates(false)
            //                        return
            //                    }
            //                    tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
            //                    var candidatesString = returnedPO.getAttributeValue("Candidates") as string;
            //                    var candidates = candidatesString.split(';');
            //                    tempThis._setCandidates(candidates);
            //                    tempThis._setShowCandidates(true)
            //                }, 4000)
            //            },
            //            false
            //        );
            //        reader.readAsDataURL(this.input.files[0]);
            //    }
            //}
            AlprData.prototype._sendForm = function (e) {
                return __awaiter(this, void 0, void 0, function () {
                    var optionOfMessage, textarea, dropdown, m, premadeMessageId, plate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                optionOfMessage = "";
                                textarea = (document.getElementById("inputSelfWrittenMelding"));
                                dropdown = (document.getElementById("problemDropdown"));
                                //chekcen of ze een voorgemaakte message hebben of niet
                                if (this.selectedOption == 0) {
                                    m = this.alprDataPo.getAttributeValue("Message");
                                    if (m === "") {
                                        //foutmelding tonen lege melding
                                        this._setMessageEmptyAfterSend(true);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        //foutmelding verbergen van lege melding
                                        this._setMessageEmptyAfterSend(false);
                                        //message zetten op PO
                                        this.alprDataPo.setAttributeValue("Message", textarea.value);
                                        optionOfMessage = textarea.value;
                                    }
                                }
                                else {
                                    premadeMessageId = dropdown.options[this.selectedOption].value;
                                    optionOfMessage = premadeMessageId;
                                    //message zetten op PO
                                    this.alprDataPo.setAttributeValue("Message", premadeMessageId);
                                }
                                plate = this.alprDataPo.getAttributeValue("LicensePlate");
                                if (plate != null) {
                                    if (plate === "null" || plate === "" || plate.length > 18) {
                                        this._setPlateEmptyAfterSend(true);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        this._setPlateEmptyAfterSend(false);
                                    }
                                }
                                else {
                                    this._setPlateEmptyAfterSend(true);
                                    return [2 /*return*/];
                                }
                                //Indien een geldige message en geldige nummerplaat:
                                return [4 /*yield*/, this.alprDataPo.getAction("SendMessage").execute()];
                            case 1:
                                //Indien een geldige message en geldige nummerplaat:
                                _a.sent();
                                //redirecten
                                window.location.replace("/Confirmation");
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AlprData.prototype._setValueDropdown = function () {
                // Dropdown selecteren
                var e = (document.getElementById("problemDropdown"));
                // value opvragen van selected option
                this.selectedOption = e.selectedIndex;
                // Boolean aanpassen om textarea te tonen
                this._writeOwnMessage();
            };
            AlprData.prototype._writeOwnMessage = function () {
                //Hier value checken van dropdown;
                if (this.selectedOption === 0) {
                    this._setWriteOwnMessage(true);
                }
                else {
                    this._setWriteOwnMessage(false);
                }
            };
            AlprData.prototype._setMessage = function () {
                this.alprDataPo.beginEdit();
                var textarea = (document.getElementById("inputSelfWrittenMelding"));
                this.alprDataPo.setAttributeValue("Message", textarea.value);
                this._ValidateTextArea(textarea.value);
            };
            AlprData.prototype._ValidateTextArea = function (value) {
                if (value === "") {
                    this._setMessageEmptyAfterSend(true);
                    return;
                }
                else {
                    this._setMessageEmptyAfterSend(false);
                }
            };
            AlprData.prototype._isPlateValide = function () {
                var value = this.alprDataPo.getAttributeValue("LicensePlate");
                if (value == null) {
                    this._setPlateEmptyAfterSend(true);
                    this._setShowCandidates(false);
                    return false;
                }
                if (value === "" || value.length > 10) {
                    this._setPlateEmptyAfterSend(true);
                    this._setShowCandidates(false);
                    return false;
                }
                this._setPlateEmptyAfterSend(false);
                this._setShowCandidates(true);
                return true;
            };
            //change plate with candidate
            AlprData.prototype._setPlate = function (event) {
                var item = event.target.dataset.item;
                this.alprDataPo.setAttributeValue("LicensePlate", item);
                this.$$("#licensePlate").innerText = item;
            };
            AlprData.prototype._videoCaptured = function (e) {
                this._setTrueAfterPictureUpload(true);
                var tempThis = this;
                //Declaraties
                var video = document.querySelector('video');
                var canvas = document.createElement('canvas');
                function _screenshotVideo() {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    document.getElementById("screenshot").setAttribute('src', canvas.toDataURL("image/jpeg"));
                    tempThis.imageFromCamera = canvas.toDataURL("image/jpeg");
                }
                var mainLoopId;
                //Environment camera aanspreken indien aanwezig
                navigator.mediaDevices.enumerateDevices()
                    .then(function (devices) {
                    var videoDevices = [];
                    var videoDeviceID = "";
                    devices.forEach(function (device) {
                        console.log(device.kind + ": " + device.label +
                            " id = " + device.deviceId);
                        if (device.kind == "videoinput") {
                            videoDevices.push(device.deviceId);
                        }
                    });
                    if (videoDevices.length == 1) {
                        videoDeviceID = videoDevices[0];
                    }
                    else if (videoDevices.length == 2) {
                        videoDeviceID = videoDevices[1];
                    }
                    var constraints = {
                        width: { min: 390, ideal: 480, max: 3120, },
                        height: { min: 520, ideal: 640, max: 4160 },
                        deviceId: { exact: videoDeviceID }
                    };
                    return navigator.mediaDevices.getUserMedia({ video: constraints });
                })
                    .then(function (stream) { video.srcObject = stream; return new Promise(function (resolve) { return video.onplaying = resolve; }); })
                    .then(function () { return mainLoopId = setInterval(_screenshotVideo, 500); })
                    .catch(function (e) { return console.error(e); });
                this.alprDataPo.beginEdit();
                document.getElementById("screenshot").addEventListener("load", function _sendImageToAPI() {
                    return __awaiter(this, void 0, void 0, function () {
                        var returnedPO, candidatesString, candidates;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    clearInterval(mainLoopId);
                                    tempThis._setTrueAfterPictureUpload(true);
                                    return [4 /*yield*/, tempThis.alprDataPo.setAttributeValue("ImageData", tempThis.imageFromCamera)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, tempThis.alprDataPo.getAction("ProcessImage").execute()];
                                case 2:
                                    returnedPO = _a.sent();
                                    tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate");
                                    tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));
                                    if (!tempThis._isPlateValide()) {
                                        mainLoopId = setInterval(_screenshotVideo, 500);
                                        return [2 /*return*/];
                                    }
                                    tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
                                    candidatesString = returnedPO.getAttributeValue("Candidates");
                                    candidates = candidatesString.split(';');
                                    tempThis._setCandidates(candidates);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            };
            AlprData = __decorate([
                Vidyano.WebComponents.WebComponent.register({
                    properties: {
                        //voorgemaakteMeldingen: Object,
                        alprDataPo: {
                            type: Object,
                            readOnly: true
                        },
                        messages: {
                            type: Array,
                            readOnly: true
                        },
                        candidates: {
                            type: Array,
                            readOnly: true
                        },
                        writeOwnMessage: {
                            type: Boolean,
                            readOnly: true
                        },
                        messageEmptyAfterSend: {
                            type: Boolean,
                            readOnly: true
                        },
                        plateEmptyAfterSend: {
                            type: Boolean,
                            readOnly: true
                        },
                        trueAfterPictureUpload: {
                            type: Boolean,
                            readOnly: true
                        },
                        showCandidates: {
                            type: Boolean,
                            readOnly: true
                        },
                    }
                }, "aa")
            ], AlprData);
            return AlprData;
        }(Vidyano.WebComponents.WebComponent));
        WebComponents.AlprData = AlprData;
    })(WebComponents = AlprApp.WebComponents || (AlprApp.WebComponents = {}));
})(AlprApp || (AlprApp = {}));
