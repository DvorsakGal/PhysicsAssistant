import AddDeleteContent from "./AddDeleteContent";
import ContentList from "./ContentList";
import styles from "./ContentPage.module.css";

export default function ContentPage() {


    return(
        <div className={styles.container}>
            <div className={styles.addDeleteContent}>
                <AddDeleteContent />
            </div>
            <div className={styles.contentList}>
                <ContentList />
            </div>
        </div>
    )
}