import { useRouter } from "next/router";
import styles from "../../styles/coffee-store.module.css";
import Head from "next/head";
import coffeeStoresData from "../../data/coffee-stores.json";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";
import React from "react";
import useSWR from "swr";


export async function getStaticProps(staticProps :any) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore:any) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export function getStaticPaths() {
    const paths = coffeeStoresData.map((coffeeStore) => {
      return {
        params: {
          id: coffeeStore.id.toString(),
        },
      };
    });
    return {
      paths: paths,
      fallback: true,
    };
  }

const CoffeeStore = (initialProps : any) => {
  const { useEffect, useState, useContext } = React;
  const [votingCount, setVotingCount] = useState(0);

    const router = useRouter();
    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(
      initialProps.coffeeStore || {}
    );
    const {
      state: { coffeeStores },
    } = useContext(StoreContext);

    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
      if (data && data.length > 0) {
        setCoffeeStore(data[0]);
        setVotingCount(data[0].voting);
      }
    }, [data]);

    const handleUpvoteButton = async() => {
      try{
        const response = await fetch('/api/favouriteCoffeeStoreById',{
          method: 'PUT',
          body: JSON.stringify({
            id
          })
        })
        const dbCoffeeStore = await response.json();
        if(dbCoffeeStore && dbCoffeeStore.length > 0){
          let count = votingCount + 1;
          setVotingCount(count);
        }
      }catch(err){
        console.error("Error upvoting the coffee store", err);
        let count = votingCount + 1;
        setVotingCount(count);
      }
    }

    const handleCreateCoffeeStore = async (coffeeStore:any) => {
      try {
        const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
        const response = await fetch("/api/createCoffeeStore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            name,
            voting: 0,
            imgUrl,
            neighbourhood: neighbourhood || "",
            address: address || "",
          }),
        });
  
        const dbCoffeeStore = await response.json();
      } catch (err) {
        console.error("Error creating coffee store", err);
      }
    };

    useEffect(() => {
      if (isEmpty(initialProps.coffeeStore)) {
        if (coffeeStores.length > 0) {
          const findCoffeeStoreById = coffeeStores.find((coffeeStore:any) => {
            return coffeeStore.id.toString() === id; //dynamic id
          });
          setCoffeeStore(findCoffeeStoreById);
          handleCreateCoffeeStore(findCoffeeStoreById);
        }
      }else {
        // SSG
        handleCreateCoffeeStore(initialProps.coffeeStore);
      }
    }, [id]);
    const {
      name = "",
      address = "",
      neighbourhood = "",
      imgUrl = "",
    } = coffeeStore;


    if (router.isFallback) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Something went wrong retrieving coffee store page</div>;
    }

    return <div className={styles.layout}>
        <Head>
            <title>{name}</title>
            <meta name="description" content={`${name} coffee store`} />
        </Head>
        <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount || 0}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
}

export default CoffeeStore;