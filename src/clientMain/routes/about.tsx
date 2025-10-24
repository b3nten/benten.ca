export const aboutHandler = () => ({
  meta: {
    title: "About",
    description: "Learn more about My Website",
  },
});

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  );
}
