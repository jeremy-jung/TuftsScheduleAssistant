/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PlanCard.js
 *
 *
 */

import CourseSearchBar from "./CourseSearchBar";
import pStyle from "./reusableStyles/PlanCard.module.css";

function PlanCard(props) {
  const {
    cardDetail,
    dropItem,
    onRemoveCourse,
    transferCourseDetail,
    onTransferCourse,
    cardOrigin,
    handleCardOrigin,
  } = props;

  const dragOver = (e) => {
    e.preventDefault();
  };

  /*
   *  drop()
   *  purpose: when course is dropped onto a planCard
   */
  const drop = (e) => {
    dropItem(cardDetail.plan_term_id, transferCourseDetail);
    onRemoveCourse(cardOrigin, transferCourseDetail);
  };

  /*
   *  handleDoubleClick()
   *  purpose: removes course from plancard when doubleClicked
   *
   */
  const handleDoubleClick = () => {
    onRemoveCourse(cardDetail.plan_term_id, transferCourseDetail);
  };

  return (
    <div
      className={pStyle.cardContainer}
      onDragOver={dragOver}
      onDrop={drop}
      id={cardDetail.plan_term_id}
    >
      <div className={pStyle.cardTitle}>{cardDetail.plan_term_id}</div>
      <div className={pStyle.courseContainer}>
        {cardDetail.courses?.map((course) => (
          <CourseSearchBar
            draggable={true}
            courseDetail={course}
            key={course.gen_course_id}
            onTransferCourse={onTransferCourse}
            origin={cardDetail.plan_term_id}
            handleCardOrigin={handleCardOrigin}
            onDoubleClick={handleDoubleClick}
          />
        ))}
      </div>
    </div>
  );
}

export default PlanCard;