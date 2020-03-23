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
                
            
        }
    }, "aa")
    export class AlprData extends Vidyano.WebComponents.WebComponent {
        readonly alprDataPo: Vidyano.PersistentObject;
        readonly messages: { id: number, text: string }[];
        readonly writeOwnMessage: boolean;
        readonly messageEmptyAfterSend: boolean;
        readonly plateEmptyAfterSend: boolean;

        private _setAlprDataPo: (value: Vidyano.PersistentObject) => void;
        private _setMessages: (value: Array<{ id: number, text: string }>) => void;
        private _setWriteOwnMessage: (value: boolean) => void;
        private _setMessageEmptyAfterSend: (value: boolean) => void;
        private _setPlateEmptyAfterSend: (value: boolean) => void;

        public input;
        public selectedOption = 0;



        async attached() {
            super.attached();
            this._setAlprDataPo(await this.app.service.getPersistentObject(null, "AlprApp.AlprData", null));
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
                        

                    },
                    false
                );
                reader.readAsDataURL(this.input.files[0]);
            }
        }

        private _sendForm(e: Event) {
            // Hier iets doen als ze op verzenden klikken.
            var optionOfMessage = ""
            //chekcen of ze een voorgemaakte message hebben of niet
            if (this.selectedOption == 0) {
                var m = this.alprDataPo.getAttributeValue("Message");

                if (m === "") {
                    this._setMessageEmptyAfterSend(true);
                    return;
                } else {
                    this._setMessageEmptyAfterSend(false);
                    optionOfMessage = m;
                }
            } else {
                optionOfMessage = "ID: " + this.selectedOption;
            }

            var plate = this.alprDataPo.getAttributeValue("LicensePlate");
            if (plate != null) {
                if (plate === "null" || plate === "" || plate.length > 10) {
                    this._setPlateEmptyAfterSend(true);
                    return;
                } else {
                    this._setPlateEmptyAfterSend(false);
                }
            } else {
                return
            }


            alert(plate + optionOfMessage);

            
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

    }
}