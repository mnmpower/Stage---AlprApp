namespace AlprApp.WebComponents {
    @Vidyano.WebComponents.WebComponent.register({
        properties: {
            voorgemaakteMeldingen: Object,
            alprDataPo: {
                type: Object,
                readOnly: true
            },
        }
    }, "aa")
    export class AlprData extends Vidyano.WebComponents.WebComponent {
        readonly alprDataPo: Vidyano.PersistentObject;
        voorgemaakteMeldingen: Vidyano.PersistentObject[];

        private _setAlprDataPo: (value: Vidyano.PersistentObject) => void;

        public input;



        async attached() {
            super.attached();
            this._setAlprDataPo(await this.app.service.getPersistentObject(null, "AlprApp.AlprData", null));

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
    }
}