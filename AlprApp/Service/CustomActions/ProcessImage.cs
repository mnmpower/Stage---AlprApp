using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Vidyano.Service.Repository;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Data;

namespace AlprApp.Service.CustomActions
{
    public class ProcessImage : CustomAction<AlprAppEntityModelContainer>
    {
        static HttpClient client = new HttpClient();
        public Boolean plateInDB;

        public override PersistentObject Execute(CustomActionArgs e)
        {
            //declaration objects
            AlprReturn alprReturn = new AlprReturn();
            AlprWithHeader alprWithHeader = new AlprWithHeader();
            string lisencePlate = "";

            var po = e.Parent;
            var imageData = po.GetAttributeValue("ImageData").ToString();

            //creating Base64String from imageData
            string base64String = imageData.Split(',')[1];

            // Call AlprAPI...
            if (client.BaseAddress == null)
            {
                client.BaseAddress = new Uri("http://localhost:8001/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }

            try
            {
                // Create a new alprData
                AlprData alprData = new AlprData();

                //setting data in object
                alprData.image = base64String;

                //creating JsonString
                string JsonString = JsonConvert.SerializeObject(alprData);

                //making API call
                var content = new StringContent(JsonString, Encoding.UTF8, "application/json");
                var result = client.PostAsync("http://localhost:8001/plate/identify", content).Result;


                //reading result out as string.
                var responseContent = result.Content.ReadAsStringAsync().Result;

                //putting result back in object
                alprWithHeader = JsonConvert.DeserializeObject<AlprWithHeader>(responseContent);

            }
            catch (Exception ex)
            {
                // Set value in LicensePlate from Persistant Object + Creating visable error for user
                po.SetAttributeValue("LicensePlate", "Er ging iets mis. Probeer opnieuw! \n" + ex.Message);

                // Return answer
                return po;
            }

            //checking if API returned an object 
            if (alprWithHeader == null || alprWithHeader.results.Length == 0)
            {
                // Set value in LicensePlate from Persistant Object + Creating visable error for user
                po.SetAttributeValue("LicensePlate", "Geen nummerplaat gevonden. Probeer opnieuw aub! \n");
                
                // Return answer
                return po;
            } else
            {
                //save plate from API in variable
                lisencePlate = alprWithHeader.results[0].plate;
            }

            //Check if the plate is in the Database and save as boolean
            plateInDB = checkIfPlateIsInDatabase(lisencePlate);

            if (plateInDB)
            {
                //ADD SENDING THE MESSAGE AND POST IT IN DB ++ JUSTTEST PURPOSE
                lisencePlate += " - IN DB";
            } else
            {
                lisencePlate = lisencePlate.ToLower()+ " - NOT FOUND";
            }
            // Set value in LicensePlate from Persistant Object
            po.SetAttributeValue("LicensePlate", lisencePlate);

            // Return answer
            return po;

        }

        private bool checkIfPlateIsInDatabase(string plate)
        {
            try
            {
                // Declarating new ConnectionStringBuilder
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();

                // Adding connectionSting in 1 part.
                builder.ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=AlprApp;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

                // Preparing the DB connection
                using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                {
                    // Creating SQL command
                    SqlCommand command = new SqlCommand("SELECT * FROM dbo.Wagen WHERE Nummerplaat = @Nummerplaat", connection);

                    // Linking the parameters
                    command.Parameters.AddWithValue("Nummerplaat",plate.ToLower());

                    // open the connection
                    connection.Open();

                    // Execute SQL command and saving output
                    SqlDataReader reader = command.ExecuteReader();

                    // Creating counter for #row's returned
                    int counter = 0;

                    // Call Read before accessing data.
                    while (reader.Read())
                    {
                        // Count every returned row
                        counter++;

                        // Read out every returned row --> Can do somthing with it if needed
                        ReadSingleRow((IDataRecord)reader);
                    }

                    // Call Close when done reading.
                    reader.Close();

                    // Check #rows retuned
                    if (counter == 0)
                    {
                        // Return False cause no plate is found
                        return false;
                    }
                    else
                    {
                        // Return True cause at least 1 plate is found
                        return true;
                    }
                }
            }
            catch (SqlException e)
            {
                // Return False cause somthing went wrong
                Console.WriteLine(e.ToString());
                return false;
            }
        }

        private static void ReadSingleRow(IDataRecord record)
        {
            // Format every row from dbo.Wagen to a sting for debug purpuses.
            string row = (String.Format("{0}, {1}, {2}", record[0], record[1], record[2]));
        }
    }
}