import { useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { phrase } from '~lib/lang';
import { Storage } from '~lib/storage';
import { Button } from '~scene/system/interface/button';
import { Confirm } from '~scene/system/interface/confirm';
import { Table } from '~scene/system/interface/table';
import { IGame } from '~type/game';
import { LangPhrase } from '~type/lang';

import { Wrapper, Empty } from './styles';

export const LoadGame: React.FC = () => {
  const game = useGame<IGame>();

  const [selectedSave, setSelectedSave] = useState(Storage.Saves[0]);
  const [saves, setSaves] = useState(Storage.Saves);
  const [confirmation, setConfirmation] = useState<Nullable<{
    message: LangPhrase
    onConfirm:() => void
  }>>(null);

  const onClickStart = () => {
    game.continueGame(selectedSave);
  };

  const deleteSave = (name: string) => {
    setConfirmation({
      message: 'CONFIRM_DELETE_SAVE',
      onConfirm: () => {
        setConfirmation(null);
        Storage.DeleteSave(name).then(() => {
          setSaves([...Storage.Saves]);
          if (selectedSave.name === name) {
            setSelectedSave(Storage.Saves[0]);
          }
        });
      },
    });
  };

  const onConfirmationClose = () => {
    setConfirmation(null);
  };

  return (
    <Wrapper>
      {confirmation && (
        <Confirm {...confirmation} onClose={onConfirmationClose} />
      )}

      {saves.length === 0 ? (
        <Empty>{phrase('SAVES_NOT_FOUND')}</Empty>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadRow>
              <Table.Cell>{phrase('SAVE_NAME')}</Table.Cell>
              <Table.Cell>{phrase('PLANET')}</Table.Cell>
              <Table.Cell>{phrase('DIFFICULTY')}</Table.Cell>
              <Table.Cell>{phrase('WAVE')}</Table.Cell>
              <Table.Cell>{phrase('SCORE')}</Table.Cell>
              <Table.Cell>{phrase('SAVE_DATE')}</Table.Cell>
              <Table.Cell />
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {saves.map((save) => (
              <Table.BodyRow
                key={save.name}
                onClick={() => setSelectedSave(save)}
                $active={save.name === selectedSave.name}
              >
                <Table.Cell>{save.name}</Table.Cell>
                <Table.Cell>{phrase(save.payload.level.planet)}</Table.Cell>
                <Table.Cell>{phrase(save.payload.game.difficulty)}</Table.Cell>
                <Table.Cell>{save.payload.wave.number}</Table.Cell>
                <Table.Cell>{save.payload.player.score}</Table.Cell>
                <Table.Cell>{new Date(save.date).toLocaleString()}</Table.Cell>
                <Table.Cell
                  $type="delete"
                  onClick={() => deleteSave(save.name)}
                >
                  X
                </Table.Cell>
              </Table.BodyRow>
            ))}
          </Table.Body>
        </Table>
      )}
      <Button
        view="primary"
        size="large"
        onClick={onClickStart}
        disabled={saves.length === 0}
      >
        {phrase('START')}
      </Button>
    </Wrapper>
  );
};
