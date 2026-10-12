import { EmployerJobList } from "@/features/employers/components/employer-jobs-list";

const JobsPage = () => {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">My Job Posts</h1>
      <EmployerJobList />
    </div>
  );
};

export default JobsPage;
