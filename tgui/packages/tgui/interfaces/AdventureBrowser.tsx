import { useBackend, useLocalState } from '../backend';
import {
  Box,
  Button,
  LabeledList,
  NoticeBox,
  Section,
  Table,
} from '../components';
import { formatTime } from '../format';
import { Window } from '../layouts';
import { AdventureDataProvider, AdventureScreen } from './ExodroneConsole';

type Adventure = {
  approved: boolean;
  id: string;
  json_status: string;
  name: string;
  ref: string;
  timestamp: string;
  uploader: string;
  version: number;
};

type AdventureBrowserData = AdventureDataProvider & {
  adventure_data: any;
  adventures: Array<Adventure>;
  delay_message: string;
  delay_time: number;
  feedback_message: string;
  play_mode: boolean;
};

const AdventureEntry = (props) => {
  const { data, act } = useBackend<AdventureBrowserData>();
  const { entry_ref, close }: { close: () => void; entry_ref: string } = props;
  const entry = data.adventures.find((x) => x.ref === entry_ref);

  if (!entry) {
    return null;
  }

  return (
    <Section>
      <LabeledList>
        <LabeledList.Item label="ID">{entry.id}</LabeledList.Item>
        <LabeledList.Item label="Name">{entry.name}</LabeledList.Item>
        <LabeledList.Item label="JSON Version">
          {entry.version}
        </LabeledList.Item>
        <LabeledList.Item label="Uploader">{entry.uploader}</LabeledList.Item>
        <LabeledList.Item label="Last Update">
          {entry.timestamp}
        </LabeledList.Item>
        <LabeledList.Item label="Approved">
          <Button.Checkbox
            checked={entry.approved}
            onClick={() => act('approve', { ref: entry.ref })}
          />
        </LabeledList.Item>
        <LabeledList.Item label="JSON">
          {entry.json_status}
          <Button
            onClick={() => act('upload', { ref: entry.ref })}
            content="Upload"
          />
          <Button
            onClick={() => act('download', { ref: entry.ref })}
            content="Download"
          />
        </LabeledList.Item>
      </LabeledList>
      <Button.Confirm
        onClick={() => {
          close();
          act('delete', { ref: entry.ref });
        }}
        content="Delete"
      />
      <Button onClick={() => act('play', { ref: entry.ref })} content="Play" />
      <Button
        onClick={() => act('refresh', { ref: entry.ref })}
        content="Refresh"
      />
      <Button.Confirm
        onClick={() => act('save', { ref: entry.ref })}
        content="Save"
      />
      <Button onClick={close} content="Close" />
    </Section>
  );
};

const AdventureList = (props) => {
  const { data, act } = useBackend<AdventureBrowserData>();
  const [openAdventure, setOpenAdventure] = useLocalState<string | null>(
    'openAdventure',
    null,
  );

  return (
    <>
      {openAdventure && (
        <AdventureEntry
          entry_ref={openAdventure}
          close={() => setOpenAdventure(null)}
        />
      )}
      {!openAdventure && (
        <Table>
          <Table.Row>
            <Table.Cell color="label">ID</Table.Cell>
            <Table.Cell color="label">Title</Table.Cell>
            <Table.Cell color="label">Edit</Table.Cell>
          </Table.Row>
          {data.adventures.map((adventure) => (
            <Table.Row key={adventure.ref} className="candystripe">
              <Table.Cell>{adventure.id}</Table.Cell>
              <Table.Cell>{adventure.name}</Table.Cell>
              <Table.Cell>
                <Button
                  icon="edit"
                  onClick={() => setOpenAdventure(adventure.ref)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Button onClick={() => act('create')}>Create New</Button>
          </Table.Row>
        </Table>
      )}
    </>
  );
};

const DebugPlayer = (props) => {
  const { data, act } = useBackend<AdventureBrowserData>();
  return (
    <Section
      title="Playtest"
      buttons={<Button onClick={() => act('end_play')}>End Playtest</Button>}
    >
      {data.delay_time > 0 ? (
        <Box>
          DELAY {formatTime(data.delay_time)} / {data.delay_message}
        </Box>
      ) : (
        <AdventureScreen
          adventure_data={data.adventure_data}
          drone_integrity={100}
          drone_max_integrity={100}
          hide_status
        />
      )}
    </Section>
  );
};

export const AdventureBrowser = (props) => {
  const { data } = useBackend<AdventureBrowserData>();

  return (
    <Window width={650} height={500} title="Adventure Manager">
      <Window.Content>
        {!!data.feedback_message && (
          <NoticeBox>{data.feedback_message}</NoticeBox>
        )}
        {data.play_mode ? <DebugPlayer /> : <AdventureList />}
      </Window.Content>
    </Window>
  );
};
