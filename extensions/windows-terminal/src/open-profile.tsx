import { ActionPanel, Action, Icon, List, closeMainWindow } from "@raycast/api";
import fs from "node:fs";
import os from "node:os";
import { execFile } from "node:child_process";

interface Profile {
  guid: string;
  name: string;
  hidden?: boolean;
}

interface WindowsTerminalSettings {
  profiles: {
    list: Profile[];
  };
}

export default function Command() {
  const PROFILES = JSON.parse(
    fs.readFileSync(
      `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Packages\\Microsoft.WindowsTerminal_8wekyb3d8bbwe\\LocalState\\settings.json`,
      "utf8",
    ),
  ) as WindowsTerminalSettings;

  return (
    <List searchBarPlaceholder="Search all profiles...">
      {PROFILES.profiles.list
        .filter((item) => item.hidden !== true)
        .map((item) => (
          <List.Item
            key={item.guid}
            icon={Icon.Terminal}
            title={item.name}
            keywords={
              item.guid === "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}"
                ? ["pwsh"]
                : item.guid === "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}"
                  ? ["cmd"]
                  : []
            }
            actions={
              <ActionPanel title={item.name}>
                <Action
                  icon={Icon.PlusSquare}
                  title="Open in New Tab"
                  onAction={async () => {
                    await closeMainWindow();
                    execFile("wt.exe", ["new-tab", "-p", item.name]);
                  }}
                />
                <Action
                  icon={Icon.PlusTopRightSquare}
                  title="Open in New Window"
                  onAction={async () => {
                    await closeMainWindow();
                    execFile("wt.exe", ["-p", item.name]);
                  }}
                />
                <ActionPanel.Section>
                  <Action.Open
                    icon={Icon.Code}
                    // settings.json is the case-sensitive name of the settings
                    // file for windows terminal. we do not need this.
                    // eslint-disable-next-line
                    title="Open settings.json"
                    target={`C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Packages\\Microsoft.WindowsTerminal_8wekyb3d8bbwe\\LocalState\\settings.json`}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
}
