import Input from "@/app/components/input";
import TextArea from "@/app/components/textarea";

export default function CommunityForm() {
  return (
    <form className="flex flex-col gap-5">
      <Input label="제목" placeholder="제목을 입력하세요" />
      <TextArea label="내용" placeholder="내용을 입력하세요" />
    </form>
  );
}
