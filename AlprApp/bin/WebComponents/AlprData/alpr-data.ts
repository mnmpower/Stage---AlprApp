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

                        // code om image na te kijken op nummerplaat
                        var src = reader.result;
                        await tempThis.alprDataPo.setAttributeValue("ImageData", src);
                        var returnedPO = await tempThis.alprDataPo.getAction("ProcessImage").execute();
                        tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate") as string;
                        tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));


                        var plate = tempThis.alprDataPo.getAttributeValue("LicensePlate");
                        if (plate != null) {
                            if (plate === "null" || plate === "" || plate.length > 18) {
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
            alert(plate + " - " + optionOfMessage);
            await this.alprDataPo.getAction("SendMessage").execute();

            //redirecten
            debugger;
            window.location.href = 'localhost:50000/admin';
            
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

        private _ValidatePlate(value: string) {
            if (value === "" || value.length > 10) {
                this._setPlateEmptyAfterSend(true);
                return;
            } else {
                this._setPlateEmptyAfterSend(false);
            }
        }

        private _setPlate(event) {
            const item = event.target.dataset.item;
            this.alprDataPo.setAttributeValue("LicensePlate", item);
            this.$$("#licensePlate").innerText = item;
        }

    }
}