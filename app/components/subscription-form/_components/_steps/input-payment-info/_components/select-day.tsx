import SelectBox from "@/app/components/select-box";

interface Props {
  value: number | null;
  onValueChange: (value: number | null) => void;
}

const today = new Date().getDate();

export default function SelectDay({ value, onValueChange }: Props) {
  return (
    <SelectBox
      value={value?.toString() ?? ""}
      onValueChange={(value) => onValueChange?.(value ? Number(value) : null)}
    >
      <SelectBox.Wrapper>
        <SelectBox.Label>몇일마다 결제하나요?</SelectBox.Label>
        <SelectBox.Trigger>
          <SelectBox.Value placeholder={today.toString() + "일"} />
        </SelectBox.Trigger>
        <SelectBox.Content>
          {Array.from({ length: 31 }, (_, index) => (
            <SelectBox.Item key={index} value={(index + 1).toString()}>
              {index + 1}일
            </SelectBox.Item>
          ))}
        </SelectBox.Content>
      </SelectBox.Wrapper>
    </SelectBox>
  );
}
