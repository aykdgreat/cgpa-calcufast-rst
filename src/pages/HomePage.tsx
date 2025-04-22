import { FC, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../supabase";
import { toast } from "sonner";
interface Data {
  courseCode: string;
  units: number;
  grade: string;
}

interface Saved {
  id?: number;
  level: string;
  semester: string;
  gpa: string;
  data: Data[];
  user_id: any;
}
const HomePage: FC = () => {
  const [level, setLevel] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [units, setUnits] = useState<number>(0);
  const [grade, setGrade] = useState<string>("");
  const [inputData, setInputData] = useState<Data[]>([]);
  const [gpa, setGpa] = useState<string>("");
  const [savedData, setSavedData] = useState<Saved[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { user } = useAuth();
  // console.log(user);

  useEffect(() => {
    calculate();
  }, [inputData]);

  useEffect(() => {
    fetchSavedData();
  }, [savedData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !units || !grade) {
      toast.error("All fields must be filled");
      return;
    }

    const input: Data = { courseCode, units, grade };
    const exists = inputData.find(
      (item) => item.courseCode === input.courseCode,
    );
    if (exists) {
      toast.error("Course code already exists!");
      return;
    }
    setInputData([...inputData, input]);
    calculate();

    setCourseCode("");
    setUnits(0);
    setGrade("");
  };

  const calculate = () => {
    let p = 0;
    let ucounter = 0;
    let pcounter = 0;
    inputData.map((item) => {
      // console.log(item.units);
      switch (item.grade) {
        case "A":
          p = 5;
          break;
        case "B":
          p = 4;
          break;
        case "C":
          p = 3;
          break;
        case "D":
          p = 2;
          break;
        case "E":
          p = 1;
          break;
        case "F":
          p = 0;
          break;
      }
      ucounter += item.units;
      let qp = p * item.units;
      pcounter += qp;
    });

    setGpa((pcounter / ucounter).toFixed(2));
  };

  const handleSave = async () => {
    if (!level || !semester) {
      toast.error("Level and semester fields must be filled!");
      return;
    } else if (!(inputData.length > 0)) {
      toast.error("There must be at least one record to save!");
      return;
    }

    const toSave: Saved = {
      level,
      semester,
      gpa,
      data: inputData,
      user_id: user?.user_metadata.sub,
    };

    const exists = savedData?.find(
      (item) =>
        item.level === toSave.level && item.semester === toSave.semester,
    );
    if (exists) {
      toast.error(
        `Result for ${toSave.level} ${toSave.semester} semester has already been saved`,
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("saved").insert([toSave]).select();
    if (!error)
      // console.log(data[0]);
      // await fetchSavedData();
      // setSavedData([...savedData, data[0]]);
      console.log(error);
    setLoading(false);
  };

  const handleDelete = (code: string) => {
    let inputDataCopy = inputData;
    inputDataCopy = inputData.filter((data) => data.courseCode !== code);
    setInputData(inputDataCopy);
    calculate();
  };

  const fetchSavedData = async () => {
    let { data: saved, error } = await supabase
      .from("saved")
      .select("*")
      .eq("user_id", user?.user_metadata.sub);
    if (!error && saved !== null) {
      // console.log(saved);
      setSavedData([...saved]);
    } else {
      console.log(error);
    }
  };

  const handleRemoveSaved = async (id: number | undefined) => {
    setDeleteLoading(true);
    const { error } = await supabase.from("saved").delete().eq("id", id);
    if (!error) {
      toast.success("Saved result has been deleted successfully");
      setDeleteLoading(false);
    }
  };

  return (
    <section className="gap-6 md:grid md:grid-cols-2">
      <div className="block w-full p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm basis-1/2">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Semester GPA
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="level"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
              >
                <option value="">Select level</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5">Year 5</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="semester"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
              >
                <option value="" defaultValue="">
                  Select semester
                </option>
                <option value="1st">First Semester</option>
                <option value="2nd">Second Semester</option>
              </select>
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="course_code"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course
              </label>
              <input
                type="text"
                id="course_code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.slice(0, 8))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder="MAT 101"
              />
            </div>
            <div>
              <label
                htmlFor="course_unit"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Unit
              </label>
              <select
                id="couse_unit"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
              >
                <option value="" defaultValue="">
                  Select unit
                </option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="course_grade"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Grade
              </label>
              <select
                id="couse_grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
              >
                <option value="" defaultValue="">
                  Select grade
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="text-white mr-4 mb-2 cursor-pointer  focus:outline-none disabled:bg-black/70 bg-black/80 hover:bg-black sm:w-auto font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            Add
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="text-white cursor-pointer disabled:bg-black/70  focus:outline-none bg-black/90 hover:bg-black sm:w-auto font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
      <div className="mb-12 overflow-x-auto rounded-lg shadow-sm basis-1/2">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course title
              </th>
              <th scope="col" className="px-6 py-3">
                Unit(s)
              </th>
              <th scope="col" className="px-6 py-3">
                Grade
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inputData.length > 0 && (
              <tr className="bg-white">
                <td className="px-6 py-4" colSpan={4}>
                  <h1 className="font-bold text-center ">GPA:</h1>
                  <p className="font-bold text-center text-8xl">{gpa}</p>
                </td>
              </tr>
            )}
            {inputData.length > 0 &&
              inputData.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.courseCode.toUpperCase()}
                  </th>
                  <td className="px-6 py-4"> {item.units}</td>
                  <td className="px-6 py-4"> {item.grade}</td>
                  <td className="px-6 py-4">
                    <button className="mr-1 font-semibold text-green-500 cursor-pointer">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.courseCode)}
                      className="font-semibold text-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {inputData.length == 0 && (
              <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4" colSpan={4}>
                  {" "}
                  No data yet, use the form above to start!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm basis-1/2">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Saved Results
        </h1>
        <div className="relative mb-12 overflow-x-auto rounded-lg shadow-sm basis-1/2">
          <table className="w-full text-sm text-left rtl:text-right">
            <tbody>
              {savedData?.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4"> {index + 1}</td>
                  <th
                    scope="row"
                    className="py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.level}
                  </th>
                  <td className="py-4 mr-8"> {item.semester} semester</td>
                  <td className="py-4"> {item.gpa}</td>
                  <td className="py-4">
                    <button className="mr-1 font-semibold cursor-pointer">
                      View
                    </button>
                    <button
                      disabled={loading}
                      className="font-semibold text-red-600 cursor-pointer disabled:text-red-400"
                      onClick={() => handleRemoveSaved(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {savedData?.length == 0 && (
                <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4" colSpan={4}>
                    No saved result, use the form above to save!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
