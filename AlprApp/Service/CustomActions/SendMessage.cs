using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Vidyano.Service.Repository;
using AlprApp.Models;
using System.Linq;
using AlprApp.Service.Actions;
using System.Data.Entity;

namespace AlprApp.Service.CustomActions
{
    public class SendMessage : CustomAction<AlprAppEntityModelContainer>
    {
        
        public override PersistentObject Execute(CustomActionArgs e)
        {
            // declareer het PO
            var po = e.Parent;

            //alle atributen opslagen in variabelen
            var messageOrId = po.GetAttributeValue("Message").ToString();
            var inDB = po.GetAttributeValue("InDB").ToString();
            var plate = po.GetAttributeValue("LicensePlate").ToString();

            //Chekcen of plaat in de DB zit.
            if (inDB.Equals("IN DB"))
            {
                //Message aanmaken + opvullen van persoonCarID
                Message message = new Message();
                Car car = (Car) Context.Cars.Where(c => c.LicensePlate == plate).Include(c => c.PersonCars).FirstOrDefault();
                
                message.MessageID = 0;
                try
                {
                    //nakijken of er een auto met deze plaat NU een bedrifjswagen is van iemand.
                    message.PersonCarID = car.PersonCars.Where( p => p.StartDate < DateTime.Now && DateTime.Now < p.EndDate).FirstOrDefault().PersonCarID;
                }
                catch (Exception)
                {
                    //Geen wagen gevonden die nu van iemand is: niets versturen
                    return null;
                }

                //Kijken of de message een ID is of een melding
                if (int.TryParse(messageOrId, out int premadeMessageId))
                {
                    // voorgemaakte message ID zetten en rest op null
                    message.PremadeMessageID = premadeMessageId;
                    message.Text = null;
                } else
                {
                    //text zetten en rest op null
                    message.PremadeMessageID = null; ;
                    message.Text = messageOrId;
                }

                //Messageopslagen in DB
                Context.Messages.Add(message);
                Context.SaveChangesAsync();

                // Hier mail versturen

            }

            //niets doen en redirecten

            return null;
        }
    }
}