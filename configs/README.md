# Camera Configs

Community-contributed configuration snippets for integrating cameras with popular NVR and home automation platforms.

## Structure

```
configs/
├── frigate/           # Frigate NVR YAML snippets
│   └── reolink-rlc-823a.yml
├── home-assistant/    # Home Assistant integration notes
│   └── reolink-rlc-823a.yml
└── blue-iris/         # Blue Iris profiles
    └── reolink-rlc-823a.yml
```

Each file is named after the camera's `id` from the database (e.g. `reolink-rlc-823a.yml`).

## How to contribute

1. Pick a camera you own and have a working config for
2. Create a YAML file in the appropriate platform folder
3. Replace sensitive values with placeholders: `{user}`, `{pass}`, `{ip}`
4. Include any notes about firmware version, gotchas, or non-default settings
5. Open a pull request

Or [submit a config via GitHub issue](../../issues/new?template=add-config.yml) if you prefer not to fork.

## Frigate config template

```yaml
# Camera: {brand} {model}
# Tested firmware: {version}
# Contributor: @{github_username}

cameras:
  camera_name:
    ffmpeg:
      inputs:
        - path: rtsp://{user}:{pass}@{ip}:554/main_stream_path
          roles: [record]
        - path: rtsp://{user}:{pass}@{ip}:554/sub_stream_path
          roles: [detect]
    detect:
      width: 1280
      height: 720
      fps: 5

# Notes:
# - Any setup steps, gotchas, or tips
```

## Home Assistant config template

```yaml
# Camera: {brand} {model}
# Integration: onvif / brand-specific / frigate
# Contributor: @{github_username}

# Notes:
# - Which integration works best
# - Any required camera-side settings
# - Known limitations
```

When a config is submitted and approved, a maintainer will also add the key details to the camera's JSON file under the `configs` field so it's queryable in the dataset.
