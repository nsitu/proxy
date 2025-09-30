# Proxy
This NodeJS Express app uses [httpxy](https://www.npmjs.com/package/httpxy) to forward incoming requests to a given target address. For this purpose the app expects to find a `PROXY_TARGET` variable in the environment.

# Fixed IP Use Case
This proxy is most useful when hosted on a server with a fixed IP address. In this case you can add the server IP address to an `allowlist`. For example, some APIs require you to define a list of trusted IPs. Configured in this way, the proxy will be recognized by the API, and can make valid requests on behalf of your client, regardless of the client's IP.

# Finding the server's IP
For convenience this app includes an `/ip` endpoint that will attempt to discover the server's public IP address via a third party service [https://api.ipify.org/](https://api.ipify.org/). 