import { useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { Button } from '~scene/system/interface/button';
import { Table } from '~scene/system/interface/table';
import { IGame } from '~type/game';
import { StorageSave } from '~type/storage';

import { Wrapper } from './styles';

export const LoadGame: React.FC = () => {
  const game = useGame<IGame>();

  const [selectedSave, setSelectedSave] = useState<Nullable<StorageSave>>(null);
  const [saves, setSaves] = useState(game.storage.saves);

  const onClickStart = () => {
    if (selectedSave) {
      game.continueGame(selectedSave);
    }
  };

  const deleteSave = (event: MouseEvent, name: string) => {
    event.stopPropagation();

    // eslint-disable-next-line no-alert
    if (window.confirm('Do you confirm delete this save?')) {
      game.storage.delete(name).then(() => {
        setSaves([...game.storage.saves]);
        if (selectedSave?.name === name) {
          setSelectedSave(null);
        }
      });
    }
  };

  return (
    <Wrapper>
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
              onClick={() => setSelectedSave(save)}
              $active={save.name === selectedSave?.name}
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
      <Button
        view="primary"
        size="medium"
        disabled={!selectedSave}
        onClick={onClickStart}
      >
        Start
      </Button>
    </Wrapper>
  );
};
