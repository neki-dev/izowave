import { useGame } from 'phaser-react-ui';
import React, {
  useRef, ChangeEvent, useEffect, useState,
} from 'react';

import { MAX_GAME_SAVES } from '~const/game';
import { Button } from '~scene/system/interface/button';
import { Table } from '~scene/system/interface/table';
import { IGame } from '~type/game';
import { StorageSave } from '~type/storage';

import { Input, Limit, Wrapper } from './styles';

export const SaveGame: React.FC = () => {
  const game = useGame<IGame>();

  const [saves, setSaves] = useState(game.storage.saves);
  const [saveName, setSaveName] = useState('');

  const refInput = useRef<HTMLInputElement>();

  const onSelectSave = (save: StorageSave) => {
    setSaveName(save.name);
  };

  const onChangeSaveName = (event: ChangeEvent<HTMLInputElement>) => {
    setSaveName(event.target.value);
  };

  const onClickSave = () => {
    if (!saveName) {
      return;
    }

    const exist = saves.some((save) => save.name === saveName);

    // eslint-disable-next-line no-alert
    if (!exist || window.confirm('Do you confirm rewrite this save?')) {
      game.storage.save(game, saveName).then(() => {
        setSaveName('');
        setSaves([...game.storage.saves]);
      });
    }
  };

  const deleteSave = (event: MouseEvent, name: string) => {
    event.stopPropagation();

    // eslint-disable-next-line no-alert
    if (window.confirm('Do you confirm delete this save?')) {
      game.storage.delete(name).then(() => {
        setSaves([...game.storage.saves]);
      });
    }
  };

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, []);

  return (
    <Wrapper>
      {saves.length > 0 && (
        <Table>
          <Table.Head>
            <Table.HeadRow>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Planet</Table.Cell>
              <Table.Cell>Difficulty</Table.Cell>
              <Table.Cell>Wave</Table.Cell>
              <Table.Cell>Score</Table.Cell>
              <Table.Cell>Date</Table.Cell>
              <Table.Cell />
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {saves.map((save) => (
              <Table.BodyRow
                key={save.name}
                onClick={() => onSelectSave(save)}
                $active={save.name === saveName}
              >
                <Table.Cell>{save.name}</Table.Cell>
                <Table.Cell>{save.payload.level.planet}</Table.Cell>
                <Table.Cell>{save.payload.game.difficulty}</Table.Cell>
                <Table.Cell>{save.payload.wave.number}</Table.Cell>
                <Table.Cell>{save.payload.player.score}</Table.Cell>
                <Table.Cell>{new Date(save.date).toLocaleString()}</Table.Cell>
                <Table.Cell
                  $type="delete"
                  onClick={(event: MouseEvent) => deleteSave(event, save.name)}
                >
                  X
                </Table.Cell>
              </Table.BodyRow>
            ))}
          </Table.Body>
        </Table>
      )}
      {saves.length >= MAX_GAME_SAVES ? (
        <Limit>You have maximum saves. Delete or rewrite exist</Limit>
      ) : (
        <Input
          type="text"
          placeholder="Save name"
          value={saveName}
          autoFocus={true}
          onChange={onChangeSaveName}
        />
      )}
      <Button
        view="primary"
        size="medium"
        disabled={!saveName}
        onClick={onClickSave}
      >
        Save
      </Button>
    </Wrapper>
  );
};
