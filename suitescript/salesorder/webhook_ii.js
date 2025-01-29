/**
 @NApiVersion 2.0
 @NScriptType ClientScript
 */
define(['N/ui/message'], function(message) {

    function pageInit(context) {
        var currentRecord = context.currentRecord;

        // Get all fields
        var allFields = getAllFields(currentRecord);

        // Display in console and NetSuite UI
        console.log("All Fields:\n", allFields);
        showMessage("All Fields and Sublists printed in console!");
    }

    function getAllFields(record) {
        var fieldList = {};
        
        // Get all top-level fields
        var fieldIds = record.getFields();
        fieldList["Main Fields"] = {};
        fieldIds.forEach(function(fieldId) {
            fieldList["Main Fields"][fieldId] = record.getValue({ fieldId: fieldId });
        });

        // Get all sublists
        var sublists = record.getSublists();
        fieldList["Sublists"] = {};

        sublists.forEach(function(sublistId) {
            fieldList["Sublists"][sublistId] = [];

            var lineCount = record.getLineCount({ sublistId: sublistId });
            for (var i = 0; i < lineCount; i++) {
                var sublistData = {};
                var sublistFieldIds = record.getSublistFields({ sublistId: sublistId });

                sublistFieldIds.forEach(function(sublistFieldId) {
                    sublistData[sublistFieldId] = record.getSublistValue({
                        sublistId: sublistId,
                        fieldId: sublistFieldId,
                        line: i
                    });
                });

                fieldList["Sublists"][sublistId].push(sublistData);
            }
        });

        return fieldList;
    }

    function showMessage(text) {
        message.create({
            title: "Info",
            message: text,
            type: message.Type.INFORMATION
        }).show();
    }

    return {
        pageInit: pageInit
    };
});
