# Usage

-   set `enabled` in setting.json (`{bdsxDir}/ostag/setting.json`)
-   if true, after players joined, players' device os will be shown under their nametag
-   you can set custom tags for each OSs. `\ue103` is special emoji for MCBE

```json
{
    "enabled": true,
    "UNKNOWN": "UNKNOWN",
    "ANDROID": "ANDROID",
    "IOS": "IOS",
    "OSX": "OSX",
    "AMAZON": "AMAZON",
    "GEAR_VR": "GEAR_VR",
    "HOLOLENS": "HOLOLENS",
    "WINDOWS_10": "WINDOWS_10\ue103",
    "WIN32": "WIN32",
    "DEDICATED": "DEDICATED",
    "TVOS": "TVOS",
    "PLAYSTATION": "PLAYSTATION",
    "NINTENDO": "NINTENDO",
    "XBOX": "XBOX",
    "WINDOWS_PHONE": "WINDOWS_PHONE"
}
```

# Changelogs

-   Update .gitignore & .npmignore
-   Add custom tags
