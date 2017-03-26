var app = angular.module("MailConfig", []);

var baseWebserviceUrl = "http://192.168.1.152:1028/mail-config/services/provider";
//var baseWebserviceUrl = "http://localhost:8080/mail-config/services/providers";

app.controller("MailConfigController", function($scope, $http) {

    $scope.initializeTestData = function() {

        // Test Data with Gmail Configuration
        $scope.mailConfig = {"provider": "gmail"};
        //$scope.mailConfig.smtp = {"mail": "smtp.gmail.com", "secure": "tls", "port": 587};
        //$scope.mailConfig.imap = {"mail": "imap.gmail.com", "secure": "ssl", "port": 993};
        //$scope.mailConfig.pop3 = {"mail": "pop.gmail.com", "secure": "ssl", "port": 995};
    };

    $scope.initializeTestData();

    // Save or update a mail configuration to/in the Database
    $scope.saveOrUpdateMailConfig = function() {
        delete $scope.json;
        delete $scope.webserviceResponse;

        var rawObject = {};
        angular.forEach($scope.mailConfig, function(value, key) {
            rawObject[key] = value;
        });

        var json = angular.toJson(rawObject);
        $scope.json = json;

        // HTTP PUT Call to the RESTful Webservice
        var provider = angular.lowercase($scope.mailConfig["provider"]);

        var request = {
            method: "PUT",
            url: baseWebserviceUrl + "/" + provider,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: json
        };

        $http(request).then(
            function successCallback(response) {
                if (response.status == 201 || response.status == 200) {
                    $scope.webserviceResponse = response.data;
                }
            },
            function errorCallBack(response) {
                if (response.data === undefined || response.data === null ) {
                    $scope.webserviceResponse = "Webservice not available";
                } else {
                    $scope.webserviceResponse = response.data;
                }
            }
        );
    };

    // Load a mail configuration from the database
    $scope.loadMailConfig = function() {

        var provider = angular.lowercase($scope.mailConfig["provider"]);

        // HTTP GET Call to the RESTful Webservice
        var request = {
            method: "GET",
            url: baseWebserviceUrl + "/" + provider
        };

        $scope.mailConfig = {"provider": provider};

        $http(request).then(
            function successCallback(response) {
                if (response.status == 200) {
                    $scope.mailConfig = response.data;
                    $scope.webserviceResponse = JSON.stringify(response.data);
                }
            },
            function errorCallBack(response) {
                if (response.data === undefined || response.data === null ) {
                    $scope.webserviceResponse = "Webservice not available";
                } else {
                    $scope.webserviceResponse = response.data;
                }
            }
        );
    };

    // Delete a mail configuration from the database
    $scope.deleteMailConfig = function() {

        var provider = angular.lowercase($scope.mailConfig["provider"]);

        // HTTP DELETE Call to the RESTful Webservice
        var request = {
            method: "DELETE",
            url: baseWebserviceUrl + "/" + provider
        };

        $http(request).then(
            function successCallback(response) {
                if (response.status == 200) {
                    $scope.webserviceResponse = response.data;
                }
            },
            function errorCallBack(response) {
                if (response.data === undefined || response.data === null ) {
                    $scope.webserviceResponse = "Webservice not available";
                } else {
                    $scope.webserviceResponse = response.data;
                }
            }
        );

        $scope.mailConfig = {"provider": provider};
    };

});

app.controller("OverviewController", function ($scope, $http) {

    $scope.date = new Date();

    // Get all mail configurations from the database
    // This will be run on page load
    angular.element(document).ready(function () {

        // HTTP GET Call to the RESTful Webservice
        var request = {
            method: "GET",
            url: baseWebserviceUrl
        };

        $http(request).then(
            function successCallback(response) {
                if (response.status == 200) {
                    $scope.mailConfigs = response.data;
                }
            },
            function errorCallBack(response) {
                if (response.data === undefined || response.data === null ) {
                    $scope.webserviceResponse = "Webservice not available";
                } else {
                    $scope.webserviceResponse = response.data;
                }
            }
        );
    });
});

