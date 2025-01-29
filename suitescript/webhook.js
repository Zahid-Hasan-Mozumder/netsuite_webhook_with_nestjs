/**
@NApiVersion 2.0
@NScriptType UserEventScript
*/

define(['N/https', 'N/runtime'], function (https, runtime) {

    function afterStatusChange(context) {

	var newRecord = context.newRecord;
        var orderStatus = newRecord.getValue({fieldId : 'orderstatus'});
      
        if (orderStatus === "B") {

            var webhookUrl = "https://9fe8-103-112-54-213.ngrok-free.app/hook/webhook";
            var responseBody = { "status" : "Pending Fullfilment" };
            
            try {

                var response = https.post({
                    url : webhookUrl,
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(responseBody)
                });

                log.debug("Response send successfully", response.body);

            } catch (error) {

                log.debug("Error occurs", error.message);

            }
        }
    }

    return {
        afterSubmit: afterStatusChange
    }

})