## GitHub Copilot Chat

- Extension: 0.42.3 (prod)
- VS Code: 1.114.0 (e7fb5e96c0730b9deb70b33781f98e2f35975036)
- OS: win32 10.0.26200 x64
- GitHub Account: gurpreetsingh0707

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (7 ms)
- DNS ipv6 Lookup: Error (152 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (17 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch (active): Error (945 ms): TypeError: fetch failed
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:103:5)
    at t._fetch (c:\Users\gourav nar\.vscode\extensions\github.copilot-chat-0.42.3\dist\extension.js:5171:5228)
    at t.fetch (c:\Users\gourav nar\.vscode\extensions\github.copilot-chat-0.42.3\dist\extension.js:5171:4540)
    at u (c:\Users\gourav nar\.vscode\extensions\github.copilot-chat-0.42.3\dist\extension.js:5203:186)
    at yg._executeContributedCommand (file:///c:/Program%20Files/Microsoft%20VS%20Code/e7fb5e96c0/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:501:48675)
  Error: getaddrinfo ENOTFOUND api.github.com
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: Error (3 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- DNS ipv6 Lookup: 