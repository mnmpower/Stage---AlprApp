namespace AlprApp.WebComponents {
    @Vidyano.WebComponents.WebComponent.register({
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
    export class AlprData extends Vidyano.WebComponents.WebComponent {
        readonly alprDataPo: Vidyano.PersistentObject;
        readonly messages: { id: number, text: string }[];
        readonly candidates: string[];
        readonly writeOwnMessage: boolean;
        readonly messageEmptyAfterSend: boolean;
        readonly plateEmptyAfterSend: boolean;
        readonly trueAfterPictureUpload: boolean;
        readonly showCandidates: boolean;

        private _setAlprDataPo: (value: Vidyano.PersistentObject) => void;
        private _setMessages: (value: Array<{ id: number, text: string }>) => void;
        private _setCandidates: (value: Array<string>) => void;
        private _setWriteOwnMessage: (value: boolean) => void;
        private _setMessageEmptyAfterSend: (value: boolean) => void;
        private _setPlateEmptyAfterSend: (value: boolean) => void;
        private _setTrueAfterPictureUpload: (value: boolean) => void;
        private _setShowCandidates: (value: boolean) => void;

        public input;
        public selectedOption = 0;



        async attached() {
            super.attached();
            this._setAlprDataPo(await this.app.service.getPersistentObject(null, "AlprApp.AlprData", null));
            this._setCandidates([]);
            this._setWriteOwnMessage(true);
            this._setMessageEmptyAfterSend(false);
            this._setPlateEmptyAfterSend(false);

            // ObjectArray declareren
            let messageArray: { id: number, text: string }[] = [];

            // Samengestelde string 1:DDD;2:DDDD;...
            let messagesString = this.alprDataPo.getAttributeValue("Messages");

            // Array met string 1:DDD, string 2:DDDD ...
            let messagesMetID = messagesString.split(';');

            // String splitsen en omzetten naar Object
            for (var i = 0; i < messagesMetID.length - 1; i++) {
                var splitsen = messagesMetID[i].split(':');
                var message = {
                    id: splitsen[0],
                    text: splitsen[1]
                }
                // Object toevoegen aan Array
                messageArray.push(message);
            }

            // Array zetten als property
            this._setMessages(messageArray);

            //opwarmen van de API
            //this.alprDataPo.beginEdit();
            //this.alprDataPo.setAttributeValue("ImageData", "1,1");
            //this.alprDataPo.getAction("ProcessImage").execute();
        }

        private _imageCaptured(e: Event) {
            this._setTrueAfterPictureUpload(true);
            this.input = e.target as HTMLInputElement;

            if (this.input.files && this.input.files[0]) {
                var reader = new FileReader();
                this.alprDataPo.beginEdit();

                var tempThis = this;
                reader.addEventListener(
                    "load",
                    async function () {

                        //mijn code om de image te tonen
                        var img = document.createElement('img');
                        img.setAttribute('src', reader.result.toString());
                        img.setAttribute('class', "thumb-image img-fluid");

                        var imageHolder = document.getElementById("image-holder");

                        imageHolder.innerHTML = "";

                        imageHolder.appendChild(img);
                        //tot hier
                        setInterval(async () => {

                            // code om image na te kijken op nummerplaat
                            var src = reader.result;
                            await tempThis.alprDataPo.setAttributeValue("ImageData", src);
                            var returnedPO = await tempThis.alprDataPo.getAction("ProcessImage").execute();
                            tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate") as string;
                            tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));


                            var plate = tempThis.alprDataPo.getAttributeValue("LicensePlate");
                            if (plate != null) {
                                if (plate === "null" || plate === "" || plate.length > 12) {
                                    tempThis._setPlateEmptyAfterSend(true);
                                    tempThis._setShowCandidates(false)
                                    return;
                                } else {
                                    tempThis._setPlateEmptyAfterSend(false);
                                }
                            } else {
                                tempThis._setPlateEmptyAfterSend(true);
                                tempThis._setShowCandidates(false)
                                return
                            }

                            tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
                            var candidatesString = returnedPO.getAttributeValue("Candidates") as string;
                            var candidates = candidatesString.split(';');
                            tempThis._setCandidates(candidates);
                            tempThis._setShowCandidates(true)
                        },4000)
                    },
                    false
                );
                reader.readAsDataURL(this.input.files[0]);
            }
        }

        private async _sendForm(e: Event) {
            // Hier iets doen als ze op verzenden klikken.
            var optionOfMessage = ""
            var textarea = (document.getElementById("inputSelfWrittenMelding")) as HTMLSelectElement;
            var dropdown = (document.getElementById("problemDropdown")) as HTMLSelectElement;

            //chekcen of ze een voorgemaakte message hebben of niet
            if (this.selectedOption == 0) {

                //message ophalen en kijken of ze niet leeg is
                var m = this.alprDataPo.getAttributeValue("Message");

                if (m === "") {
                    //foutmelding tonen lege melding
                    this._setMessageEmptyAfterSend(true);
                    return;
                } else {
                    //foutmelding verbergen van lege melding
                    this._setMessageEmptyAfterSend(false);

                    //message zetten op PO
                    this.alprDataPo.setAttributeValue("Message", textarea.value);
                    optionOfMessage = textarea.value;
                }
            } else {
                //Value ophalen van de dropdownbox (is de voorgemaakteMessageID)
                var premadeMessageId = dropdown.options[this.selectedOption].value;
                optionOfMessage = premadeMessageId;

                //message zetten op PO
                this.alprDataPo.setAttributeValue("Message", premadeMessageId);
            }


            //Checken of een plaat gevonden is in een foto
            var plate = this.alprDataPo.getAttributeValue("LicensePlate");
            if (plate != null) {
                if (plate === "null" || plate === "" || plate.length > 18) {
                    this._setPlateEmptyAfterSend(true);
                    return;
                } else {
                    this._setPlateEmptyAfterSend(false);
                }
            } else {
                this._setPlateEmptyAfterSend(true);
                return
            }

            //Indien een geldige message en geldige nummerplaat:
            await this.alprDataPo.getAction("SendMessage").execute();

            //redirecten
            window.location.replace("/Confirmation");
        }

        private _setValueDropdown() {
            // Dropdown selecteren
            var e = (document.getElementById("problemDropdown")) as HTMLSelectElement;

            // value opvragen van selected option
            this.selectedOption = e.selectedIndex;

            // Boolean aanpassen om textarea te tonen
            this._writeOwnMessage();
        }

        private _writeOwnMessage() {
            //Hier value checken van dropdown;
            if (this.selectedOption === 0) {
                this._setWriteOwnMessage(true);
            } else {
                this._setWriteOwnMessage(false);
            }

        }

        private _setMessage() {
            this.alprDataPo.beginEdit();
            var textarea = (document.getElementById("inputSelfWrittenMelding")) as HTMLSelectElement;
            this.alprDataPo.setAttributeValue("Message", textarea.value);

            this._ValidateTextArea(textarea.value);
        }

        private _ValidateTextArea(value: string) {
            if (value === "") {
                this._setMessageEmptyAfterSend(true);
                return;
            } else {
                this._setMessageEmptyAfterSend(false);
            }
        }

        private _isPlateValide() {
            var value = this.alprDataPo.getAttributeValue("LicensePlate");
            if (value == null) {
                return false;
            }

            if (value === "" || value.length > 10) {
                return false;
            }
            return true;
        }

        private _setPlate(event) {
            const item = event.target.dataset.item;
            this.alprDataPo.setAttributeValue("LicensePlate", item);
            this.$$("#licensePlate").innerText = item;
        }









        private _videoCaptured(e: Event) {
            this._setTrueAfterPictureUpload(true);

            var tempThis = this;

            //Declaraties
            const video = document.querySelector('video');
            const canvas = document.createElement('canvas');
            const videoSelect = document.querySelector('select#videoSource');
            //var img = document.createElement('img');
            const img = (document.getElementById("screenshot"));
            //groote van de camera definieren
            const constraints = {
                video: {
                    width: {
                        min: 390,
                        ideal: 480,
                        max: 3120,
                    },
                    height: {
                        min: 520,
                        ideal: 640,
                        max: 4160
                    },
                    facingMode: 'environment'
                },
                audio: false
                //video: { width: { exact: 480 }, height: { exact: 640 } }
            };


            //video starten
            //navigator.mediaDevices.getUserMedia(constraints)
            //    .then((stream) => { video.srcObject = stream })
            //    .catch(error => { console.error(error) });


            //VAN HIER  FF tEST
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
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
                        videoDeviceID = videoDevices[0]
                    } else if (videoDevices.length == 2) {
                        videoDeviceID = videoDevices[1]
                    }


                    var constraints = {
                        width: {
                            min: 390,
                            ideal: 480,
                            max: 3120,
                        },
                        height: {
                            min: 520,
                            ideal: 640,
                            max: 4160
                        },
                        deviceId: { exact: videoDeviceID }
                    };
                    return navigator.mediaDevices.getUserMedia({ video: constraints });

                })
                .then((stream) => { video.srcObject = stream })
                .catch(e => console.error(e));
            //TOT HIER TT tEST

            // To start the loop

            if (!tempThis._isPlateValide()) {

                var imageHolder = document.getElementById("image-holder");

                var mainLoopId = setInterval(async function _screenshotVideo() {
                    //screenshot nemen + senden naar API
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    img.setAttribute('src', canvas.toDataURL("image/jpeg"));
                    img.setAttribute('class', "thumb-image img-fluid");



                    imageHolder.appendChild(img);
                    //plate zetten
                    tempThis.alprDataPo.beginEdit();
                    //tempThis._setPlateEmptyAfterSend(false);
                    //tempThis._setTrueAfterPictureUpload(true);



                    await tempThis.alprDataPo.setAttributeValue("ImageData", canvas.toDataURL("image/jpeg"));
                    const returnedPO = await tempThis.alprDataPo.getAction("ProcessImage").execute();

                    tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate") as string;
                    tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));

                    //Indien niet valide herhalen
                    if (tempThis._isPlateValide()) {

                        // indien wel valide, doorgaan
                        clearInterval(mainLoopId);
                        alert("valide plate");

                        var plate = tempThis.alprDataPo.getAttributeValue("LicensePlate");
                        if (plate != null) {
                            if (plate === "null" || plate === "" || plate.length > 12) {
                                tempThis._setPlateEmptyAfterSend(true);
                                tempThis._setShowCandidates(false)
                                return;
                            } else {
                                tempThis._setPlateEmptyAfterSend(false);
                            }
                        } else {
                            tempThis._setPlateEmptyAfterSend(true);
                            tempThis._setShowCandidates(false)
                            return
                        }

                        tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
                        var candidatesString = returnedPO.getAttributeValue("Candidates") as string;
                        var candidates = candidatesString.split(';');
                        tempThis._setCandidates(candidates);
                        tempThis._setShowCandidates(true)

                    }



                }, 3000);


            }



        }
    }
}