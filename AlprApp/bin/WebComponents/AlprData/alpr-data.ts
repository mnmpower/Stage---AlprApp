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
                
            
        }
    }, "aa")
    export class AlprData extends Vidyano.WebComponents.WebComponent {
        readonly alprDataPo: Vidyano.PersistentObject;
        readonly messages: { id: number, text: string }[];

        private _setAlprDataPo: (value: Vidyano.PersistentObject) => void;
        private _setMessages: (value: Array<{ id: number, text: string } >) => void;

        public input;



        async attached() {
            super.attached();
            this._setAlprDataPo(await this.app.service.getPersistentObject(null, "AlprApp.AlprData", null));

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

        private DoeIets(e: Event) {
            alert("15");
        }

        private _WriteOwnMessage(str: String) {
            debugger;
            //Hier value checken van dropdown;
            return false;
        }
    }
}