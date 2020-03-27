using System;
using Vidyano.Service.Repository;
using System.Linq;
using AlprApp.Service.Actions;
using System.Data.Entity;
using System.Net.Mail;
using System.Net;
using System.Net.Http;
using AlprApp.Properties;

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

                //car ophalen met de doorgegeven numerplaat
                Car car = (Car)Context.Cars.Where(c => c.LicensePlate == plate).Include(c => c.PersonCars).First();

                //persooncar ophalen indien die bestaat met een contract momenteel
                var pc = car.PersonCars.Where(p => p.StartDate < DateTime.Now && DateTime.Now < p.EndDate).FirstOrDefault();

                // indien null, return, anders dorgaan
                if (pc != null)
                {
                    message.MessageID = 0;
                    message.PersonCarID = pc.PersonCarID;


                    // ophalen van PersoonCar om email uit te halen van de jusite persoon
                    var personCar = Context.PersonCars.Where(p => p.PersonCarID == message.PersonCarID).Include(p => p.Person).FirstOrDefault();
                    var employee = personCar.Person;

                    // string aanmaken voor in mail te plaatsen
                    string PremadeOrSelfWritten;

                    // string aanmaken voor de melding zelf mail te plaatsen
                    string messageInMail;

                    //--------------------------------HIERTUSSEN ALLES PROBEREN VAN ONDERAAN
                    //Kijken of de message een ID is of een melding
                    if (int.TryParse(messageOrId, out int premadeMessageId))
                    {
                        // voorgemaakte message ID zetten en rest op null
                        message.PremadeMessageID = premadeMessageId;
                        message.Text = null;
                        PremadeOrSelfWritten = "voorgemaakte";
                        string PremadeMessage = Context.PremadeMessages.Where(p => p.PremadeMessageID == premadeMessageId).FirstOrDefault().Text;
                        messageInMail = PremadeMessage;
                    }
                    else
                    {
                        //text zetten en rest op null
                        message.PremadeMessageID = null; ;
                        message.Text = messageOrId;
                        PremadeOrSelfWritten = "zelfgeschreven";
                        messageInMail = messageOrId;
                    }

                    //Messageopslagen in DB
                    Context.Messages.Add(message);
                    Context.SaveChangesAsync();

                    // SMTP configuratie
                    SmtpClient client = new SmtpClient(Settings.Default.smtpClient, Settings.Default.smtpPort);
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(Settings.Default.smtpEmail, Settings.Default.smtpPwd);
                    client.EnableSsl = true;

                    //mail voorbereidingen
                    string emailTo = employee.Email;
                    string subject = Settings.Default.EmailSubject;
                    string body = "" +
                        "Geachte " + employee.FristName + " " + employee.LastName +
                        "\n" +
                        "\nEr is op " + DateTime.Now.ToString("dd/MM/yyyy") + " om " + DateTime.Now.ToString("HH:mm") + " een melding gemaakt van een mogelijks probleem met uw bedrijfswagen." +
                        "\nDe persoon in kwestie verstuurde een  " + PremadeOrSelfWritten + " melding, namelijk:" +
                        "\n" +
                        "\n" + messageInMail +
                        "\n" +
                        "\nMet vriendelijke groeten" +
                        "\nHet IT-team van Rhea N.V.";


                    //mail Configuratie
                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(Settings.Default.smtpEmail);
                    mailMessage.To.Add(emailTo);
                    mailMessage.Body = body;
                    mailMessage.Subject = subject;

                    //mail sturen
                    client.Send(mailMessage);
                    //--------------------------------
                }
            }

            //niets returnen;
            return null;
            
        }
    }
}