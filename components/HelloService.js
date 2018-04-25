(function() {
  angular
    .module("app")
    .service("HelloService", function HelloService(
      $q,
      hello,
      settings,
      $rootScope,
      $cookies
    ) {
      var tenantName = settings.adB2C.tenantName;
      var clientId = settings.adB2C.clientId;
      var policy = settings.adB2C.policy;
      var network = "adB2CSignInSignUp";
      this.initialize = function() {
        //initiate all policies
        hello.init(
          {
            adB2CSignIn: clientId,
            adB2CSignInSignUp: clientId,
            adB2CEditProfile: clientId
          },
          {
            redirect_uri: "../",
            //redirect_uri: 'https://semasp04.semel.ext/CarServilanve',
            scope: "openid " + clientId,
            response_type: "token id_token"
          }
        );
        var adB2CSignInSignUpPolicy = getPolicyConfiguredData();
        hello.init(adB2CSignInSignUpPolicy);
        var authResponse = hello(network).getAuthResponse();
        if (authResponse && !authResponse.error) {
          return $q.when(authResponse);
        } else {
          var error =
            authResponse && authResponse.error ? authResponse.error : "";
          return $q.reject(error);
        }
      };

      this.login = function() {
        hello(network).login({
          display: "page",
          force: true
        });
      };
      this.logout = function() {
        hello(network).logout({
          force: true
        });
      };

      function getPolicyConfiguredData() {
        var adB2CSignInSignUpPolicy = {};
        adB2CSignInSignUpPolicy[network] = {
          name: "Azure Active Directory B2C",
          oauth: {
            version: 2,
            auth:
              "https://login.microsoftonline.com/tfp/" +
              tenantName +
              "/" +
              policy +
              "/oauth2/v2.0/authorize",
            grant:
              "https://login.microsoftonline.com/tfp/" +
              tenantName +
              "/" +
              policy +
              "/oauth2/v2.0/token"
          },
          refresh: true,
          scope_delim: " ",
          form: false
        };
        adB2CSignInSignUpPolicy[network].xhr = function(p) {
          if (p.method === "post" || p.method === "put") {
            //toJSON(p);
            if (typeof p.data === "object") {
              // Convert the POST into a javascript object
              try {
                p.data = JSON.stringify(p.data);
                p.headers["content-type"] = "application/json";
              } catch (e) {}
            }
          } else if (p.method === "patch") {
            hello.utils.extend(p.query, p.data);
            p.data = null;
          }
          return true;
        };
        adB2CSignInSignUpPolicy[network].logout = function() {
          //get id_token from auth response
          var id_token = hello(network).getAuthResponse().id_token;
          //clearing local storage session
          hello.utils.store(network, null);

          //redirecting to Azure B2C logout URI
          window.location =
            "https://login.microsoftonline.com/" +
            tenantName +
            "/oauth2/v2.0/logout?p=" +
            policy +
            "&id_token_hint=" +
            id_token +
            "&post_logout_redirect_uri=https://login.microsoftonline.com/" +
            tenantName +
            "/oauth2/logout";
        };
        return adB2CSignInSignUpPolicy;
      }
    });
})();
