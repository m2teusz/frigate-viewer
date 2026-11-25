import React, {FC, useCallback, useMemo, useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFormsStyles} from './styles';
import {useStyles} from '../../helpers/colors';

interface IDropdownOption {
  value: any;
  label?: string;
}

interface IDropdownProps {
  value?: any;
  options: IDropdownOption[];
  onValueChange?: (value: any) => void;
  title?: string;
}

/**
 * Lista wyboru w półprzezroczystym oknie dialogowym:
 * tap poza listą albo przycisk "wstecz" zamyka bez zmiany,
 * aktualny wybór jest zaznaczony ✓.
 */
export const Dropdown: FC<IDropdownProps> = ({
  value,
  options,
  onValueChange,
  title,
}) => {
  const formsStyles = useFormsStyles();
  const styles = useStyles(({theme}) => ({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000aa',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    dialog: {
      maxHeight: '70%',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.background,
      elevation: 8,
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    itemSelected: {
      backgroundColor: theme.highlighted,
    },
    itemPressed: {
      opacity: 0.6,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.border,
      marginHorizontal: 20,
    },
    itemText: {
      color: theme.text,
      fontSize: 16,
    },
    itemTextSelected: {
      fontWeight: '600',
    },
    check: {
      color: theme.text,
      fontSize: 16,
      marginLeft: 12,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chevron: {
      color: theme.text,
      opacity: 0.6,
      marginLeft: 8,
    },
  }));

  const [opened, setOpened] = useState<boolean>(false);

  const selected = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);

  const select = useCallback(
    (option: IDropdownOption) => () => {
      close();
      if (onValueChange && option.value !== value) {
        onValueChange(option.value);
      }
    },
    [close, onValueChange, value],
  );

  const labelOf = (option?: IDropdownOption) =>
    option ? option.label ?? String(option.value) : '';

  return (
    <>
      <Modal
        visible={opened}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={close}>
        <Pressable style={styles.overlay} onPress={close} />
        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.dialog}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({item}) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    style={({pressed}) => [
                      styles.item,
                      isSelected ? styles.itemSelected : undefined,
                      pressed ? styles.itemPressed : undefined,
                    ]}
                    onPress={select(item)}>
                    <Text
                      style={[
                        styles.itemText,
                        isSelected ? styles.itemTextSelected : undefined,
                      ]}>
                      {labelOf(item)}
                    </Text>
                    {isSelected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <Pressable style={formsStyles.input} onPress={open}>
        <View style={styles.inputRow}>
          <Text style={formsStyles.inputText}>{labelOf(selected)}</Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
      </Pressable>
    </>
  );
};
