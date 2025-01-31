import { useSession } from '@supabase/auth-helpers-react';
import { usePosts } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';
import { PostSkeleton } from './PostSkeleton';

interface PostListProps {
  selectedTheme: string | null;
}

const PostList = ({ selectedTheme }: PostListProps) => {
  const session = useSession();
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = usePosts(selectedTheme);
  
  const { handleLike, handleComment, handleDeletePost, handleUpdatePost } = usePostActions(refetch);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  return (
    <>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="space-y-4">
          {page.posts.map((post, postIndex) => {
            const isLastPost = pageIndex === data.pages.length - 1 && postIndex === page.posts.length - 1;
            
            return (
              <PostCard
                key={post.id}
                post={post}
                isLastPost={isLastPost}
                lastPostRef={node => {
                  if (isLastPost && node && hasNextPage && !isFetchingNextPage) {
                    const observer = new IntersectionObserver(entries => {
                      if (entries[0].isIntersecting) {
                        fetchNextPage();
                      }
                    });
                    observer.observe(node);
                    return () => observer.disconnect();
                  }
                }}
                onLike={() => handleLike(post.id)}
                onComment={(content) => handleComment(post.id, content)}
                onDelete={() => handleDeletePost(post.id)}
                onUpdate={(content) => handleUpdatePost(post.id, content)}
                session={session}
              />
            );
          })}
        </div>
      ))}
      
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </>
  );
};

export default PostList;