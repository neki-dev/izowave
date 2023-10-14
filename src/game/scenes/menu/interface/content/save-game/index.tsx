import { useGame } from 'phaser-react-ui';
import React, {
  useRef, ChangeEvent, useEffect, useState,
} from 'react';

import { MAX_GAME_SAVES } from '~const/game';
import { phrase } from '~lib/lang';
import { Storage } from '~lib/storage';
import { Button } from '~scene/system/interface/button';
import { Table } from '~scene/system/interface/table';
import { IGame } from '~type/game';
import { StorageSave } from '~type/storage';

import { Input, Limit, Wrapper } from './styles';

export const SaveGame: React.FC = () => {
  const game = useGame<IGame>();

  const [saves, setSaves] = useState(Storage.Saves);
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

    if (!exist || window.confirm(phrase('CONFIRM_REWRITE_SAVE'))) {
      Storage.AddSave(game, saveName).then(() => {
        setSaveName('');
        setSaves([...Storage.Saves]);
        game.isSaved = true;
      });
    }
  };

  const deleteSave = (event: MouseEvent, name: string) => {
    event.stopPropagation();

    if (window.confirm(phrase('CONFIRM_DELETE_SAVE'))) {
      Storage.DeleteSave(name).then(() => {
        setSaves([...Storage.Saves]);
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
                onClick={() => onSelectSave(save)}
                $active={save.name === saveName}
              >
                <Table.Cell>{save.name}</Table.Cell>
                <Table.Cell>{phrase(save.payload.level.planet)}</Table.Cell>
                <Table.Cell>{phrase(save.payload.game.difficulty)}</Table.Cell>
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
        <Limit>{phrase('SAVES_LIMIT')}</Limit>
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
        {phrase('SAVE')}
      </Button>
    </Wrapper>
  );
};
