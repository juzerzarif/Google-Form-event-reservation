/*
* Logs the given message in a Google Doc with a timestamp
*/
function doc_log(message) {
    var logDocId = "1CHZ16wYvvIx4qOon5YnaQlRvHmSF6kU3B2zPAUInJ08";
    var logger = DocumentApp.openById(logDocId);
    var timestamp = new Date();

    logger.getBody().appendParagraph("[" + timestamp + "] " + message);
    logger.saveAndClose();
}