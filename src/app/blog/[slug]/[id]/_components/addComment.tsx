import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/SubmitBtn';
import { SessionUser } from '@/lib/sessions';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { CommentEntity } from '@/lib/types/modelTypes';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { saveComment } from '@/lib/actions/commentActions';
import { useActionState, useEffect } from 'react';

type Props = {
  postId: number;
  user: SessionUser;
  className?: string;
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        comments: CommentEntity[];
        count: number;
      },
      Error
    >
  >;
};

const AddComment = (props: Props) => {
  const [state, action] = useActionState(saveComment, undefined);

  useEffect(() => {
    if (state?.message)
      toast(state?.ok ? 'Success' : 'Oops!', {
        description: state?.message,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    //   toast({
    //     title: state?.ok ? "Success" : "Oops!",
    //     description: state?.message,
    //   });
    if (state?.ok) props.refetch();
  }, [props, state]);
  return (
    <Dialog open={state?.open}>
      <DialogTrigger asChild>
        <Button>Leave Your Comment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Write Your Comment</DialogTitle>

        <form action={action} className={cn(props.className)}>
          <input hidden name="postId" defaultValue={props.postId} />
          <Label htmlFor="comment">Your Comment</Label>
          <div className="border-t border-x rounded-t-md">
            <Textarea
              className="border-none active:outline-none focus-visible:ring-0 shadow-none"
              name="content"
            />
            {!!state?.errors?.content && (
              <p className="text-red-500 animate-shake">
                {state.errors.content}
              </p>
            )}
          </div>
          <p className="border rounded-b-md p-2">
            <span className="text-slate-400">Write as </span>
            <span className="text-slate-700">{props.user.name}</span>
          </p>
          <SubmitButton className="mt-2">Submit</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComment;
