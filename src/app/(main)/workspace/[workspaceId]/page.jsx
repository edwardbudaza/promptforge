import { ChatView } from '@/components/custom/chat-view';
import { CodeView } from '@/components/custom/code-view';

const WorkspacePage = () => {
  return (
    <div className="p-3 pr-5 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ChatView />
        <div className="col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
};
export default WorkspacePage;
