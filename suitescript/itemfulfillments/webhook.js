/**
@NApiVersion 2.0
@NScriptType UserEventScript
*/

define(['N/https', 'N/runtime', 'N/record'], function (https, runtime, record) {

    function afterStatusChange(context) {

        var newRecord = context.newRecord;
        var shipStatus = newRecord.getValue({ fieldId: 'shipstatus' });
        var salesOrderId = newRecord.getValue({ fieldId: 'orderid' });
        salesOrderId = Number(salesOrderId);
        var salesOrder = record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderId
        });

        var message = [];
        var status = "No Status"
        if (shipStatus === "A") status = "Picked";
        if (shipStatus === "B") status = "Packed";
        if (shipStatus === "C") status = "Shipped";

        var lineCount = salesOrder.getLineCount({ sublistId: 'item' });
        for (var i = 0; i < lineCount; i++) {
            var itemId = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
            var quantityFulfilled = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantityfulfilled', line: i });
            var originalQuantity = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'origquantity', line: i });
            var quantityPickPackship = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantitypickpackship', line: i });

            var inProcess = quantityPickPackship - quantityFulfilled;
            var remaining = originalQuantity - quantityPickPackship;
            
            if(remaining){
                message.push(
                    {
                        itemId: itemId,
                        alreadyFulFilled : quantityFulfilled,
                        inProcess: inProcess,
                        originalQuantity: originalQuantity,
                        remaining: remaining,
                        Type: "Partially",
                        status: status
                    }
                )
            }
            else{
                message.push(
                    {
                        itemId: itemId,
                        alreadyFulFilled : quantityFulfilled,
                        inProcess: inProcess,
                        originalQuantity: originalQuantity,
                        remaining: remaining,
                        Type: "Fully",
                        status: status
                    }
                )
            }
        }

        var webhookUrl = "https://a993-103-112-54-213.ngrok-free.app/hook/webhook";
        var responseBody = { "response": message };

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