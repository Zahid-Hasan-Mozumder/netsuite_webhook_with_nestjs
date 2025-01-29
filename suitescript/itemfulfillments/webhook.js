/**
@NApiVersion 2.0
@NScriptType UserEventScript
*/

define(['N/https', 'N/runtime'], function (https, runtime) {

    function afterStatusChange(context) {

        var newRecord = context.newRecord;
        var shipStatus = newRecord.getValue({ fieldId: 'shipstatus' });

        var message = "No Status";
        if (shipStatus === "A") message = "Picked";
        if (shipStatus === "B") message = "Packed";
        if (shipStatus === "C") message = "Shipped";

        var webhookUrl = "https://2b98-103-112-54-213.ngrok-free.app/hook/webhook";
        var responseBody = { "status": message };

        try {

            var response = https.post({
                url: webhookUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(responseBody)
            });

            log.debug("Response send successfully", response.body);

        } catch (error) {

            log.debug("Error occurs", error.message);

        }
    }

    return {
        afterSubmit: afterStatusChange
    }

})