using AlprApp.Models;
using AlprApp.Service.Actions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Vidyano.Core.Extensions;
using Vidyano.Service;
using Vidyano.Service.Charts;
using Vidyano.Service.Repository;

namespace AlprApp.Service
{
    public class AlprDataActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: AlprData */>
    {
        public override void OnNew(PersistentObject obj, PersistentObject parent, Query query, Dictionary<string, string> parameters)
        {

            base.OnNew(obj, parent, query, parameters);
            

        }

        public override void OnLoad(PersistentObject obj, PersistentObject parent)
        {
            base.OnLoad(obj, parent);

            string messagesString = "";
            List<PremadeMessage> messagesList = Context.PremadeMessages.ToList();

            foreach (var premadeMessage in messagesList)
            {
                messagesString += premadeMessage.PremadeMessageID;
                messagesString += ":";
                messagesString += premadeMessage.Text;
                messagesString += ";";

            }

            obj.SetAttributeValue("Messages", messagesString);
            obj.SetAttributeValue("Message", "");


        }

    }
}