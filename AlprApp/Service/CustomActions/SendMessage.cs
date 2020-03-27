using System;
using Vidyano.Service.Repository;
using System.Linq;
using AlprApp.Service.Actions;
using System.Data.Entity;
using System.Net.Mail;
using System.Net;
using System.Net.Http;
using AlprApp.Properties;
using System.Resources;

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
                    var logo = "data:image / png; base64,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";
                    string body = String.Format(Settings.Default.EmailBody, employee.FristName, employee.LastName, DateTime.Now.ToString("dd/MM/yyyy"), DateTime.Now.ToString("HH:mm"), PremadeOrSelfWritten, messageInMail, logo);


                    //mail Configuratie
                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(Settings.Default.smtpEmail);
                    mailMessage.To.Add(emailTo);
                    mailMessage.IsBodyHtml = true;
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
